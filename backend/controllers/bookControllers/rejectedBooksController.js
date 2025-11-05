import Book from "../../models/SellBooks.js"; 

const rejectedBooks = async(req,res)=>{
  try {
     
    const userId= req.user.id

    const books = await Book.find({ status: 'Rejected',seller:userId });
    res.status(200).json({message: "Rejected books fetched successfully",books})
      
  }catch(err){
    res.status(500).json({ error: err.message });
  }
};

export default rejectedBooks;