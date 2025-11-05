import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  oldPassword: {
    type: String,
  },
  isVerified: { type: Boolean, default: false },
  verificationotp: { type: Number },
  resetPasswordotp: { type: Number },
  resetPasswordExpires: { type: Date },
  paymentHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
  purchasedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

const User = mongoose.model("User", userschema);
export default User;
