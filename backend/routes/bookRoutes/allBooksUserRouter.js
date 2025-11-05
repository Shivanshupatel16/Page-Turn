import getUserBooks from "../../controllers/bookControllers/allBooksUser.js";
import express from 'express'
import authMiddleware from "../../middleware/authMiddleware.js";

const getUserBooksRoute= express.Router()

getUserBooksRoute.get("/userBooks",authMiddleware,getUserBooks)

export default getUserBooksRoute;
