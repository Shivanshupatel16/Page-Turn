import User from "../../models/User.js";
import bcrypt from "bcrypt";

const userProfile = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { name, email, password, oldPassword } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized", status: false });
  }

  if (userId != id) {
    return res.status(403).json({
        message: "Forbidden: You can only update your own profile",
        status: false,
      });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    const updateData = {};

    if (password) {
      if (!oldPassword) {
        return res.status(400).json({
          message: "Old password is required to update the password",
          status: false,
        });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect", status: false });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedProfile = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProfile) {
      return res.status(404).json({ message: "Failed to update user", status: false });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      status: true,
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: false,
    });
  }
};

export default userProfile;
