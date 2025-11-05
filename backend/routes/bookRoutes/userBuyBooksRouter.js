import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import userBuyBooks from "../../controllers/bookControllers/userBuyBooks.js";

const buyBooksRouter = express.Router();

buyBooksRouter.get("/buy/user", authMiddleware, userBuyBooks);

export default buyBooksRouter;
