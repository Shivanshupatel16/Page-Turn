import ApprovedBook from "../../models/ApprovedBook.js";

const getallBooks = async(req,res)=>{
    try {
        const allBooks= await ApprovedBook.find().sort({ createdAt: -1 });
            res.status(200).json({status:true,message:"Books fetched successfully",allBooks})
    } catch (error) {
        return res.status(500).json({status:false,error})
    }
}

export default getallBooks;