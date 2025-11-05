import getallBooks from "../../controllers/bookControllers/dashBoardBooks.js";
import express from 'express'
import authMiddleware from "../../middleware/authMiddleware.js";

const dashboardRouter= express.Router()

dashboardRouter.get("/allBooks",authMiddleware,getallBooks)

export default dashboardRouter