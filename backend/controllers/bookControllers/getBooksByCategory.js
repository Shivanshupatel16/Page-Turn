import ApprovedBook from "../../models/ApprovedBook.js";

const getBooksCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const books = await ApprovedBook.find({ category })
      .sort({ createdAt: -1 }); 

    if (books.length === 0) {
      return res.status(200).json({
        message: `No books found in ${category} category`,
        status: true,
        books: [],
      });
    }

    res.status(200).json({
      message: `Books fetched from ${category} category`,
      status: true,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching category books",
      status: false,
      error: error.message,
    });
  }
};

export default getBooksCategory;