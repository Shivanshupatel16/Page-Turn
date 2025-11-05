import User from "../../models/User.js";
import mongoose from "mongoose";

const aboutUser = async(req,res)=>{
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized", status: false });
      }
      try {
        const user= await User.findById(userId).select("-password -__v");
        res.status(200).json({status:true,message:"Profile fetched successfully",user})
    } catch (error) {
        return res.status(500).json({status:false,error})
    }
}

export default aboutUser