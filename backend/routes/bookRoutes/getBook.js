
import express from 'express'
import authMiddleware from "../../middleware/authMiddleware.js";
import getBook from "../../controllers/bookControllers/getBook.js";

const getBookRouter=express.Router()
getBookRouter.get("/books/:id",authMiddleware,getBook)


export default getBookRouter