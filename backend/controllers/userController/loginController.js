import User from '../../models/User.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config()

const login = async(req,res)=>{
    try {
        const {email,password} = req.body

        if(!email||!password){
            return res.status(401).json({message:"All field are required"})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User does not exist! Please sign up."})
        }
        const matchPassword= await bcrypt.compare(password,user.password)

        if(!matchPassword){
            return res.status(401).json({message:"Invalid password"})
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "3hr" }
          );
          console.log(token);
          res.status(200).json({ 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role 
              },
            message: "Login successful", token });
            
            

    } catch (error) {
        console.error(" Error in logging up user:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export default login;