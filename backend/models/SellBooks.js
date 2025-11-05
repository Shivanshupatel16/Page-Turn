import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: {
      values: ['New', 'Like New', 'Very Good', 'Good', 'Acceptable'],
      message: '{VALUE} is not a valid condition'
    }
  },
  description: {
    type: String,
    trim: true
  },
  images: {
    type: [String],
    required: [true, 'At least one image is required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Rejected'],
    default: 'Pending'
  },
  rejectionReason: {
    type: String,
    default:'',
    trim: true
  },
  available: {
    type: Boolean,
    default: true
  },
  soldAt: {
    type: Date
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Fiction', 'Non-Fiction', 'Textbook', 'Children', 'Other'],
      message: '{VALUE} is not a valid category'
    }
  }
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

const Book = mongoose.model('Book', bookSchema);

export default Book;