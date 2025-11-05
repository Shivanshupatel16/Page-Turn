import mongoose from 'mongoose';

const soldBookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      default: ''
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApprovedBook',
      required: true
    },
    soldAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      default: 'Sold',
      enum: ['Sold'],
      immutable: true
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Razorpay', 'UPI', 'Cash']
    },
    transactionId: {
      type: String,
      required: true,
      index: true
    },
    status: {
    type: String,
    default: 'Sold',
    immutable: true
  },
  }, {
    timestamps: true,
    versionKey: '__v',
  });

const SoldBooks = mongoose.model('SoldBooks', soldBookSchema);

export default SoldBooks;
