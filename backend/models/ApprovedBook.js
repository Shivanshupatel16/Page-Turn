import mongoose from "mongoose";

const ApprovedBookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: String,
    price: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one image is required",
      },
    },
    category:{
      type:String
    } ,
    sold: {
      type: Boolean,
      default: false,
    },
    soldAt: Date,
    paymentStatus: {
      type: String,
      default: "Pending",
    },
    paymentId: {
      type: String,
      index: true,
    },
    paymentMethod: {
      // Add this field
      type: String,
      enum: ["Razorpay", "UPI", "Cash"],
    },
    isbn: { type: String },
    description: {
      type: String,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      // default: 'Approved'
    },
    approvedAt: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    transactionId:{
       type:String
    }
  },
  {
    timestamps: true,
    versionKey: "__v",
  }
);

export default mongoose.model("ApprovedBook", ApprovedBookSchema);
