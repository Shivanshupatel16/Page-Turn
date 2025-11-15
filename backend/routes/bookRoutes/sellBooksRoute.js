import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { upload } from "../../config/upload.js";
import sellBookController from "../../controllers/bookControllers/sellBooksController.js";

const router = express.Router();

router.post("/sellBooks", authMiddleware, upload.single("image"), sellBookController);

export default router;
