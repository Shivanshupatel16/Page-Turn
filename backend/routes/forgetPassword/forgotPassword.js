import express from "express";
import dotenv from "dotenv";
import User from "../../models/User.js";
import nodemailer from "nodemailer";

dotenv.config();

const forgotPassword = express.Router();

const sendResetPasswordEmail = async (email, verificationotp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP for password reset is:</p>
           <h2>${verificationotp}</h2>
            <p>This OTP is valid for 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(" OTP email sent successfully.");
  } catch (error) {
    console.error(" Error sending OTP email:", error);
  }
};

forgotPassword.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: " Email is required", success: false });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: " User with this email does not exist",success: false,});
    }
    user.verificationotp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendResetPasswordEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: " Server error", success: false });
  }
});

export default forgotPassword;
