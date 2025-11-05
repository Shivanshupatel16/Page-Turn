import express from 'express';
import approveBooks from '../../controllers/adminControllers/approvelBooks.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import isAdminMiddleware from '../../middleware/isAdminMiddleware.js';

const approveBookRouter = express.Router();

approveBookRouter.put('/approveBook/:id',authMiddleware, isAdminMiddleware,approveBooks);

export default approveBookRouter;
