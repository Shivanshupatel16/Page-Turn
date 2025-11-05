import User from "../../models/User.js";
import bcrypt from "bcrypt";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists! Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    await user.save();
    return res.status(201).json({ message: "User signed up successfully!" });
    
  } catch (error) {
    console.error(" Error in signing up user:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default signup;
