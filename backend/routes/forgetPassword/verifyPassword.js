import User from "../../models/User.js";
import express from "express";


const verifyPassword = express.Router();

verifyPassword.post("/verify-password", async (req, res) => {
  try {
    const { email, verificationotp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (!user.verificationotp || user.verificationotp !== parseInt(verificationotp) || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP", success: false });
    }

    user.verificationotp = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ message: "OTP verified successfully", success: true });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
});

export default verifyPassword;
