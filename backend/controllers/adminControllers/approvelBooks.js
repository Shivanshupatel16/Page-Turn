import Book from "../../models/SellBooks.js";
import ApprovedBook from "../../models/ApprovedBook.js";
import { sendApprovalEmail } from "../../utils/emailService.js";
const approveBooks = async(req,res)=>{
    const {id} = req.params
    if(!id){
       return res.status(404).json({message:"Book not found"})
    }
    try {
        const book = await Book.findById(req.params.id).populate('seller','email');
        if (!book) return res.status(404).json({ message: "Book not found" });
    
        const approved = new ApprovedBook({
          user: book.seller,
          title: book.title,
          author: book.author,
          price: book.price,
          condition: book.condition,
          images: book.images,
          category: book.category,
          status:"Approved"
        });
    
        await approved.save();
        await Book.findByIdAndDelete(req.params.id);
        if (book.seller && book.seller.email) {
          await sendApprovalEmail(book.seller.email, book.title);
        }
        res.status(200).json({ message: "Book approved and moved successfully." });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

export default approveBooks;