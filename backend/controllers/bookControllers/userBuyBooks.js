import SoldBooks from "../../models/SoldBooks.js";

const userBuyBooks = async (req, res) => {
  const userId = req.user.id;

  try {
    const boughtBooks = await SoldBooks.find({ buyerId: userId }).sort({ soldAt: -1 });

    if (!boughtBooks || boughtBooks.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No books bought by you! Go and buy your first book 🛒",
        boughtBooks: []
      });
    }

    res.status(200).json({
      status: true,
      message: "Bought books fetched successfully",
      count: boughtBooks.length,
      boughtBooks
    });
  } catch (error) {
    console.error('Error fetching purchased books:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch purchased books',
      error: error.message
    });
  }
};

export default userBuyBooks;
