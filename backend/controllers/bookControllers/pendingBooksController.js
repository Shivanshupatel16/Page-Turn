import Book from "../../models/SellBooks.js"; 

const pendingBooks = async(req,res)=>{
  try {
    const books = await Book.find({ status: 'Pending' });
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default pendingBooks