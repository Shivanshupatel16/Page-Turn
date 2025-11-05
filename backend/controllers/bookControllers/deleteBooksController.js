import Book from "../../models/SellBooks.js";

const deleteBook = async(req,res)=>{
    const {id} = req.params;

    if(!id){
        return res.status(404).json({message:"Book not found"})
    }

    try {
        const removeBook = await Book.findByIdAndDelete(id)
        if (!removeBook) {
            return res.status(404).json({ message: "No book found with this ID" });
          }

       return res.status(200).json({status:true,message:"Book deleted successfully",removeBook})
    } catch (error) {
        return res.status(401).json({status:false,error})
    }
}

export default deleteBook;