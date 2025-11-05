import mongoose from 'mongoose';
import ApprovedBook from "../../models/ApprovedBook.js";

const getBook = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid book ID"
    });
  }

  try {
    const book = await ApprovedBook.findById(id);
    if (!book) {
      return res.status(404).json({
        status: false,
        message: "Book not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Book fetched successfully",
      book
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error fetching book",
      error
    });
  }
};

export default getBook;
