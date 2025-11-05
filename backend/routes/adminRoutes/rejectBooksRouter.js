import express from 'express';
import rejectBooks from '../../controllers/adminControllers/rejectBooks.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import isAdminMiddleware from '../../middleware/isAdminMiddleware.js';

const rejectBookRouter = express.Router();

rejectBookRouter.put('/rejectBook/:id', authMiddleware,isAdminMiddleware,rejectBooks);

export default rejectBookRouter;
