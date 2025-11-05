import express from "express";
import bcrypt from "bcrypt";
import User from "../../models/User.js";


const resetPassword = express.Router();

resetPassword.post("/reset-password", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.verificationotp = null; 
        user.resetPasswordExpires = null;

        await user.save();

        return res.json({ message: "Password reset successfully", success: true });

    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
});

export default resetPassword;
