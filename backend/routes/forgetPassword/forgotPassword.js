import express from "express";
import dotenv from "dotenv";
import User from "../../models/User.js";
import nodemailer from "nodemailer";

dotenv.config();

const forgotPassword = express.Router();

// Send OTP email function with detailed logging
const sendResetPasswordEmail = async (email, verificationotp) => {
  try {
    console.log("Preparing to send OTP email to:", email);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // SSL
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    const mailOptions = {
      from: `"PageTurn Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP for password reset is:</p>
           <h2>${verificationotp}</h2>
           <p>This OTP is valid for 1 hour.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully:", info);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error; // propagate error to route
  }
};

forgotPassword.post("/forgot-password", async (req, res) => {
  try {
    console.log("Received forgot-password request:", req.body);

    const { email } = req.body;

    if (!email) {
      console.log("No email provided in request");
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", otp);

    const user = await User.findOne({ email });
    console.log("Fetched user from DB:", user);

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({
        message: "User with this email does not exist",
        success: false,
      });
    }

    user.verificationotp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    console.log("OTP saved to user document");

    await sendResetPasswordEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    console.error("Server error in forgot-password route:", error);
    res.status(500).json({ message: "Server error", success: false, error: error.message });
  }
});

export default forgotPassword;
