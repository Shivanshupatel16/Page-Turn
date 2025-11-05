import Book from "../../models/SellBooks.js"; 

const getBooks = async(req,res)=>{
    try {
        const allBooks= await Book.find();
        res.status(200).json({status:true,message:"Books fetched successfully",allBooks})
    } catch (error) {
        return res.status(500).json({status:false,error})
    }
}

export default getBooks;