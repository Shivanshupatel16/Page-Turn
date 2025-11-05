import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import userSoldBooks from "../../controllers/bookControllers/userSoldBooks.js";

const soldBooksRouter = express.Router();

soldBooksRouter.get("/sold/user", authMiddleware, userSoldBooks);

export default soldBooksRouter;
