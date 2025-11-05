import rejectedBooks from '../../controllers/bookControllers/rejectedBooksController.js'
import express from 'express'
import authMiddleware from '../../middleware/authMiddleware.js'

const rejectedBooksUserRouter= express.Router()
rejectedBooksUserRouter.get("/rejectedBooks",authMiddleware,rejectedBooks)

export default rejectedBooksUserRouter