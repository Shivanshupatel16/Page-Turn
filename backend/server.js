import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectmongo from "./database/db.js";
import signupRouter from "./routes/userRoutes/signupRoute.js";
import loginRouter from "./routes/userRoutes/loginRoute.js";
import forgotPassword from "./routes/forgetPassword/forgotPassword.js";
import verifyPassword from "./routes/forgetPassword/verifyPassword.js";
import resetPassword from "./routes/forgetPassword/resetPassword.js";
import sellBooksRouter from "./routes/bookRoutes/sellBooksRoute.js";
import getBooksRouter from "./routes/bookRoutes/getBooksRoute.js";
import deleteBookRouter from "./routes/bookRoutes/deleteBooksRoute.js";
import updateBookRouter from "./routes/bookRoutes/updateBooksRoute.js";
import approveBookRouter from "./routes/adminRoutes/approveBooksRouter.js";
import rejectBookRouter from "./routes/adminRoutes/rejectBooksRouter.js";
import pendingBooksRouter from "./routes/bookRoutes/pendingBookRoute.js";
import pendingBooksUserRouter from "./routes/bookRoutes/pendingBookUser.js";
import approvedBookRouter from "./routes/bookRoutes/appprovedBooksRouter.js";
import rejectedBooksUserRouter from "./routes/bookRoutes/rejectedBooksRouter.js";
import userProfileRouter from "./routes/userRoutes/userProfile.js";
import getUserBooksRoute from "./routes/bookRoutes/allBooksUserRouter.js";
import dashboardRouter from "./routes/bookRoutes/dashboardRoute.js";
import getBookRouter from "./routes/bookRoutes/getBook.js";
import paymentRouter from "./controllers/payment/payment.js";
import soldBooksRouter from "./routes/bookRoutes/userSoldBooksRoutes.js";
import buyBooksRouter from "./routes/bookRoutes/userBuyBooksRouter.js";
import getBooksByCategoryRouter from "./routes/bookRoutes/getBooksByCategoryRouter.js";
import dotenv from "dotenv";
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

import cors from "cors";

app.use(cors({
  origin: ["https://page-turn-navy.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/user", signupRouter);
app.use("/api/user", loginRouter);
app.use('/api/password', forgotPassword);
app.use('/api/password', verifyPassword);
app.use('/api/password', resetPassword);
app.use('/api/books', sellBooksRouter);
app.use('/api/books', getBooksRouter);
app.use('/api/books', deleteBookRouter);
app.use('/api/books', updateBookRouter);
app.use('/api/books', approveBookRouter);
app.use('/api/books', rejectBookRouter);
app.use('/api/books', pendingBooksRouter);
app.use('/api/books', pendingBooksUserRouter);
app.use('/api/books', approvedBookRouter);
app.use('/api/books', rejectedBooksUserRouter);
app.use('/api', userProfileRouter);
app.use('/api/books', getUserBooksRoute);
app.use('/api/books', dashboardRouter);
app.use('/api', getBookRouter);
app.use('/api/books', soldBooksRouter);
app.use('/api/books', buyBooksRouter);
app.use('/api/books', getBooksByCategoryRouter);

app.use('/api/payments', paymentRouter);

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

connectmongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  });