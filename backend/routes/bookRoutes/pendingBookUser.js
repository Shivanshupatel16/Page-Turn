import userPendingBooks from '../../controllers/bookControllers/userPendingBooks.js'
import express from 'express'
import authMiddleware from '../../middleware/authMiddleware.js'

const pendingBooksUserRouter=express.Router()
pendingBooksUserRouter.get("/pendingBook",authMiddleware,userPendingBooks)

export default pendingBooksUserRouter