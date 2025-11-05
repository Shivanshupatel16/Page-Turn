import approvedBooks from "../../controllers/bookControllers/approvedBooks.js";
import express from 'express'
import authMiddleware from "../../middleware/authMiddleware.js";

const approvedBookRouter = express.Router()

approvedBookRouter.get('/approvedBooks',authMiddleware,approvedBooks)

export default approvedBookRouter;