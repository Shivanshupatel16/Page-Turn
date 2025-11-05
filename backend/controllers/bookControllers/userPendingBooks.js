import Book from "../../models/SellBooks.js"; 

const userPendingBooks = async(req,res)=>{

    const userId= req.user.id
  try {
    const books = await Book.find({ status: 'Pending' ,seller:userId});
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default userPendingBooks