// routes/authRoute.js
import express from "express";
import { registerUserCtrl, loginUserCtrl } from "../controllers/authController.js";

const router = express.Router();

// /api/auth/register
router.post("/register", registerUserCtrl);

// /api/auth/login
router.post("/login", loginUserCtrl);

export default router;
