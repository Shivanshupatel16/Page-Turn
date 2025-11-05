import express from "express";
import signup from "../../controllers/userController/signupController.js";

const signupRouter = express.Router();

signupRouter.post("/signup", signup);

export default signupRouter;
