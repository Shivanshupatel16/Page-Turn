import mongoose from "mongoose";
const mongodb= `mongodb://${process.env.MONGO_URL}/PageTurn`

const connectmongo = async () =>{
    try {
       await mongoose.connect(mongodb)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed");
    }
}
 export default connectmongo;