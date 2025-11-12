import Book from "../../models/SellBooks.js";
import { upload, cloudinary } from "../../config/upload.js";
const sellBookController = async (req, res, next) => {
  try {
    const { title, author, isbn, price, condition, description, category } = req.body;
    const seller = req.user?.id;

    // ✅ Basic Validation
    const requiredFields = ["title", "author", "condition", "category", "price"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0)
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });

    if (!seller)
      return res.status(401).json({ success: false, error: "Authentication required" });

    if (!req.file)
      return res.status(400).json({ success: false, error: "At least one image is required" });


    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "pageturn_books",
    });

    const book = await Book.create({
      title,
      author,
      isbn,
      price: parseFloat(price),
      condition,
      description,
      images: [uploadResult.secure_url],
      category,
      seller,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Book listed successfully. Waiting for admin approval.",
      data: book,
    });
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    next(error);
  }
};

export default sellBookController;
