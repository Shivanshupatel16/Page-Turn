import userProfile from "../../controllers/userController/profileController.js";
import express from 'express'
import authMiddleware from "../../middleware/authMiddleware.js";
import aboutUser from "../../controllers/userController/getProfileController.js";

const userProfileRouter = express.Router()

userProfileRouter.put("/updateProfile/:id",authMiddleware,userProfile)
userProfileRouter.get("/profile",authMiddleware,aboutUser)

export default userProfileRouter;