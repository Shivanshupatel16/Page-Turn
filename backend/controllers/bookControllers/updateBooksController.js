import Book from "../../models/SellBooks.js";

const updateBook = async(req,res)=>{

    const {id} = req.params
    const { title, author, isbn, price, condition, description, category } = req.body;
     if(!id){
        return res.status(404).json({message:"Book not found"})
     }

     try {
        const update = await Book.findByIdAndUpdate(id,{ title, author, price,isbn,condition, description, category },{ new: true })
        if (!update) {
            return res.status(404).json({ message: "No book found with this ID" });
          }
          return res.status(200).json({status:true,message:"Book updated successfully",update})
     } catch (error) {
        return res.status(401).json({status:false,error})
     }
}

export default updateBook