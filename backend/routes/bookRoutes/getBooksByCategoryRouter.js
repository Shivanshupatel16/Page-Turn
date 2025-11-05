import express from "express";
import getBooksCategory from "../../controllers/bookControllers/getBooksByCategory.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const getBooksByCategoryRouter = express.Router();

getBooksByCategoryRouter.get("/category/:category",authMiddleware, getBooksCategory);

export default getBooksByCategoryRouter;
