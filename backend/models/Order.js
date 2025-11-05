import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
  },
  entity: {
    type: String,
    default: 'order'
  },
  amount: {
    type: Number,
    required: true
  },
  amount_paid: {
    type: Number,
    default: 0
  },
  amount_due: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  receipt: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['created', 'attempted', 'paid'],
    default: 'created'
  },
  attempts: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;