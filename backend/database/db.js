import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongodb= `mongodb+srv://${process.env.MONGO_URL}/Page-Turn`


const connectmongo = async () =>{
    try {
       await mongoose.connect(mongodb)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed");
    }
}
 export default connectmongo;