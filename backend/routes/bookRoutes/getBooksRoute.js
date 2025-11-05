import getBooks from "../../controllers/bookControllers/getBooksController.js";
import express from 'express'
import authMiddleware from "../../middleware/authMiddleware.js";

const getBooksRouter=express.Router()
getBooksRouter.get("/getBooks",getBooks)


export default getBooksRouter