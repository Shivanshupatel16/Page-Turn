import express from "express";
import sellBookController from "../../controllers/bookControllers/sellBooksController.js";
import upload from "../../config/multerConfig.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/sellBooks",
    authMiddleware,
    (req, res, next) => {
      express.urlencoded({ extended: true })(req, res, () => {
        upload.array("images", 5)(req, res, next);
      });
    },
    sellBookController
  );

export default router;