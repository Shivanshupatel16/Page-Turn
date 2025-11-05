import deleteBook from "../../controllers/bookControllers/deleteBooksController.js";
import express from 'express'

const deleteBookRouter = express.Router()

deleteBookRouter.delete('/deleteBook/:id', deleteBook)

export default deleteBookRouter;