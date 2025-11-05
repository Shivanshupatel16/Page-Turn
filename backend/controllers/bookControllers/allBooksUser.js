import Book from "../../models/SellBooks.js";
import ApprovedBook from "../../models/ApprovedBook.js";

const getUserBooks = async (req, res) => {
  const userId = req.user.id;

  try {
    const [sellerBooks, approvedBooks] = await Promise.all([
      Book.find({ 
        seller: userId,
        status: { $in: ['Pending', 'Rejected'] }
      }).lean(),
      ApprovedBook.find({ user: userId })
        .lean()
        .select('-__v')
        .populate('buyer', 'name email')
    ]);

    const transformedApprovedBooks = approvedBooks.map(book => ({
      _id: book._id,
      title: book.title,
      author: book.author,
      price: book.price,
      isbn: book.isbn || '',
      condition: book.condition,
      description: book.description || '',
      images: book.images,
      category: book.category,
      seller: book.user,
      buyer: book.buyer ? {
        _id: book.buyer._id,
        name: book.buyer.name,
        email: book.buyer.email
      } : null,
      status: book.sold ? 'Sold' : 'Approved',
      available: book.available !== undefined ? book.available : true,
      paymentStatus: book.paymentStatus || 'pending',
      createdAt: book.createdAt,
      updatedAt: book.updatedAt
    }));
    const allBooks = [...sellerBooks, ...transformedApprovedBooks]
      .sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      status: true,
      message: "Books fetched successfully",
      allBooks
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message
    });
  }
};

export default getUserBooks;
