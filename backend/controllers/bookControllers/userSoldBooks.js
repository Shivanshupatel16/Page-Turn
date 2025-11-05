import SoldBooks from "../../models/SoldBooks.js";

const userSoldBooks = async (req, res) => {
  const userId = req.user.id;

  try {
    const soldBooks = await SoldBooks.find({ seller: userId }).sort({ soldAt: -1 });

    if (!soldBooks || soldBooks.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No books sold yet 🧾",
        soldBooks: []
      });
    }

    res.status(200).json({
      status: true,
      message: "Sold books fetched successfully",
      count: soldBooks.length,
      soldBooks
    });
  } catch (error) {
    console.error('Error fetching sold books:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch sold books',
      error: error.message
    });
  }
};

export default userSoldBooks;
