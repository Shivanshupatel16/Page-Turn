import pendingBooks from '../../controllers/bookControllers/pendingBooksController.js'
import express from 'express'
import authMiddleware from '../../middleware/authMiddleware.js'
import isAdminMiddleware from '../../middleware/isAdminMiddleware.js'

const pendingBooksRouter=express.Router()
pendingBooksRouter.get("/pending",authMiddleware,isAdminMiddleware,pendingBooks)

export default pendingBooksRouter