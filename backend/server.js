import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import usersRoutes from "./routes/usersRoute.js";
import postsRoutes from "./routes/postsRoute.js";
import commentsRoutes from "./routes/commentsRoute.js";
import categoriesRoutes from "./routes/categoriesRoute.js";

import { notFound, errorHandler } from './middleware/error.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/categories", categoriesRoutes); // ✅

// error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
