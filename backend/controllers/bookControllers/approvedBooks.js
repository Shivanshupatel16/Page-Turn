import ApprovedBook from "../../models/ApprovedBook.js";

const approvedBooks = async(req,res)=>{

  const userId= req.user.id
    try {
        const books = await ApprovedBook.find({user:userId});
        res.status(200).json({ message:"Approved books fetched successfully",books });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

    export default approvedBooks;
