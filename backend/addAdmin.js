import User from "./models/User.js";
import bcrypt from "bcrypt"
import connectmongo from "./database/db.js";


const admin = async (email) => {
    await connectmongo()
    try {
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Admin already exists!");
            return;
        }

        const hashed = await bcrypt.hash("admin", 10);

        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashed,
            role:"admin"
        });

        await newUser.save();
        console.log("Admin created successfully");
    } catch (error) {
        console.error("Error creating admin:", error);
    }
};

admin()