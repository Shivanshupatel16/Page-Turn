import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import QRCode from "qrcode";
import ApprovedBook from "../../models/ApprovedBook.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import mongoose from "mongoose";
import SoldBooks from "../../models/SoldBooks.js";
import nodemailer from "nodemailer";
import Payment from "../../models/Payment.js";

dotenv.config();

const paymentRouter = express.Router();

if (!process.env.RAZORPAY_KEY_ID?.startsWith("rzp_")) {
  console.error("❌ Invalid Razorpay Key ID format");
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
  
});

if (!process.env.UPI_ID || !process.env.UPI_MERCHANT_NAME) {
  console.error("FATAL: UPI configuration missing in .env");
  process.exit(1);
}

const generateUPIQRLink = (amount, orderId) => {
  const amountInRs = (amount / 100).toFixed(2);
  return `upi://pay?pa=${process.env.UPI_ID}&pn=${encodeURIComponent(
    process.env.UPI_MERCHANT_NAME
  )}&am=${amountInRs}&tn=PT-${orderId}&cu=INR`;
};

// Updated create-order route
paymentRouter.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID missing from request" });
    }

    console.log("Extracted User ID:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: "Invalid user credentials" });
    }

    const book = await ApprovedBook.findById(bookId)
      .select("price title user")
      .lean();

    if (!book?.user) {
      return res.status(400).json({ error: "Book owner information missing" });
    }

    if (book.user.toString() === userId.toString()) {
      return res.status(403).json({ error: "Cannot purchase your own book" });
    }

    const amount = Math.round(book.price * 100);
    if (isNaN(amount) || amount < 100) {
      return res.status(400).json({ error: "Invalid book price" });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `order_${Math.floor(Date.now() / 1000)}_${bookId.slice(-6)}`,
      notes: { bookId },
    });

    await Payment.create({
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      book: bookId,
      user: userId,
    });

    const upiLink = generateUPIQRLink(order.amount, order.id);

    console.log("Generated UPI Link:", upiLink);
    console.log("Environment Variables:", {
      UPI_ID: process.env.UPI_ID,
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
      UPI_MERCHANT_NAME: process.env.UPI_MERCHANT_NAME,
    });

    res.status(200).json({
      success: true,
      data: {
        id: order.id,
        upi_link: upiLink,
        amount: order.amount,
        currency: order.currency,
        isTestMode: process.env.UPI_ID.includes("@razorpay"),
      },
    });
  } catch (error) {
    console.error("Order Creation Error:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage =
      error.error?.description ||
      (error instanceof mongoose.Error.ValidationError
        ? "Validation error"
        : "Payment processing failed");

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      ...(process.env.NODE_ENV === "development" && {
        details: {
          message: error.message,
          stack: error.stack,
        },
      }),
    });
  }
});

paymentRouter.get("/status/:orderId", authMiddleware, async (req, res) => {
  try {
    const order = await razorpay.orders.fetch(req.params.orderId);
    const payments = await razorpay.orders.fetchPayments(order.id);
    const paidPayment = payments.items.find((p) => p.status === "captured");

    res.json({
      status: paidPayment ? "paid" : order.status,
      payment_id: paidPayment?.id,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Status Check Error:", error);
    res.status(500).json({
      error: "Status check failed",
      details: error.message,
    });
  }
});

paymentRouter.post("/verify", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      bookId,
    } = req.body;

    const buyerId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(400).json({ error: "Invalid buyer ID" });
    }

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !bookId
    ) {
      return res
        .status(400)
        .json({ error: "Missing required payment verification fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: "Invalid book ID format" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Signature mismatch:", {
        expected: generatedSignature,
        received: razorpay_signature,
      });
      return res.status(401).json({ error: "Invalid payment signature" });
    }

    const approvedBook = await ApprovedBook.findById(bookId);
    if (!approvedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (approvedBook.user.toString() === buyerId.toString()) {
      return res.status(403).json({ error: "You cannot buy your own book" });
    }

    const soldBook = await SoldBooks.create({
      title: approvedBook.title,
      images: approvedBook.images,
      author: approvedBook.author,
      condition: approvedBook.condition,
      category: approvedBook.category,
      price: approvedBook.price,
      seller: approvedBook.user,
      buyerId: buyerId,
      bookId: approvedBook._id,
      soldAt: new Date(),
      status: "Sold",
      paymentMethod: "UPI",
      transactionId: razorpay_payment_id,
    });

    await ApprovedBook.findByIdAndDelete(bookId);

    const populatedSoldBook = await SoldBooks.findById(soldBook._id)
      .populate("seller", "name email")
      .populate("buyerId", "name email");

    const sellerUser = populatedSoldBook.seller;
    const buyerUser = populatedSoldBook.buyerId;

    res.status(201).json({
      success: true,
      message: "Book marked as sold and emails will be sent shortly",
      book: populatedSoldBook,
    });

    setTimeout(async () => {
      try {
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const sellerMailOptions = {
          from: `"PageTurn Sales" <${process.env.EMAIL_USER}>`,
          to: sellerUser.email,
          subject: `🎉 Your Book "${soldBook.title}" Has Been Sold!`,
          html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f8f9fa;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2ecc71;">🎊 Good News!</h2>
          <p>Your book <strong>${
            soldBook.title
          }</strong> has just been purchased on PageTurn.</p>
          <h3 style="color: #34495e;">📦 Book Details:</h3>
          <ul style="padding-left: 20px;">
            <li><strong>Price:</strong> ₹${soldBook.price}</li>
            <li><strong>Transaction ID:</strong> ${razorpay_payment_id}</li>
            <li><strong>Sold At:</strong> ${new Date(
              soldBook.soldAt
            ).toLocaleString()}</li>
          </ul>
          <h3 style="color: #34495e;">🧑 Buyer Info:</h3>
          <ul style="padding-left: 20px;">
            <li><strong>Name:</strong> ${buyerUser?.name || "N/A"}</li>
            <li><strong>Email:</strong> ${buyerUser?.email || "N/A"}</li>
          </ul>
          <p style="margin-top: 20px;">You can now arrange for the book delivery or contact support if you have questions.</p>
          <p style="font-size: 0.9em; color: #aaa; margin-top: 30px;">This is an automated message. Please do not reply.</p>
        </div>
      </div>
    `,
        };

        const buyerMailOptions = {
          from: `"PageTurn Sales" <${process.env.EMAIL_USER}>`,
          to: buyerUser.email,
          subject: `📚 Purchase Successful: "${soldBook.title}"`,
          html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f0f0f0;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #3498db;">🎉 Purchase Confirmed!</h2>
          <p>You've successfully purchased <strong>${
            soldBook.title
          }</strong> on PageTurn.</p>
          <h3 style="color: #34495e;">🧾 Order Summary:</h3>
          <ul style="padding-left: 20px;">
            <li><strong>Price:</strong> ₹${soldBook.price}</li>
            <li><strong>Transaction ID:</strong> ${razorpay_payment_id}</li>
            <li><strong>Purchased At:</strong> ${new Date(
              soldBook.soldAt
            ).toLocaleString()}</li>
          </ul>
          <h3 style="color: #34495e;">📞 Seller Info:</h3>
          <ul style="padding-left: 20px;">
            <li><strong>Name:</strong> ${sellerUser?.name || "N/A"}</li>
            <li><strong>Email:</strong> ${sellerUser?.email || "N/A"}</li>
          </ul>
          <p style="margin-top: 20px;">The seller will reach out to you soon for delivery arrangements.</p>
          <p style="font-size: 0.9em; color: #aaa; margin-top: 30px;">This is an automated message. Please do not reply.</p>
        </div>
      </div>
    `,
        };

        await transporter.sendMail(sellerMailOptions);
        await transporter.sendMail(buyerMailOptions);
        console.log(
          `✅ Emails sent to both seller (${sellerUser.email}) and buyer (${buyerUser.email})`
        );
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
    }, 1000);
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({
      error: "Something went wrong during payment verification",
      details: error.message,
    });
  }
});

export default paymentRouter;
