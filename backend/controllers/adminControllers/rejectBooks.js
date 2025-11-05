import Book from "../../models/SellBooks.js";
import { sendRejectionEmail } from "../../utils/emailService.js";
const rejectBooks = async(req,res)=>{
    const {id} = req.params
    const userId = req.user.id
    const {rejectionReason} = req.body;
    if(!id){
       return res.status(404).json({message:"Book not found"})
    }
    if (!rejectionReason?.trim()) {
        return res.status(400).json({ message: "Rejection reason is required" });
    }
    try {
        const book = await Book.findByIdAndUpdate(id,userId,{ status: "Rejected",rejectionReason },{ new: true } ).populate('seller','email');
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (book.seller && book.seller.email) {
          await sendRejectionEmail(book.seller.email, book.title, rejectionReason);
        }
        res.status(200).json({ message: "Book rejected successfully.",book });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

export default rejectBooks;