import express from 'express';
import updateBook from '../../controllers/bookControllers/updateBooksController.js';

const updateBookRouter = express.Router();

updateBookRouter.put('/updateBook/:id', updateBook);

export default updateBookRouter;
