import express from "express";
import {
  registerUserCtrl,
  loginUserCtrl,
  forgotPassword,     // ✅ جديد
  resetPassword       // ✅ جديد
} from "../controllers/authController.js";

const router = express.Router();

// /api/auth/register
router.post("/register", registerUserCtrl);

// /api/auth/login
router.post("/login", loginUserCtrl);

// /api/auth/forgot-password
router.post("/forgot-password", forgotPassword); // ✅ جديد

// /api/auth/reset-password/:token
router.post("/reset-password/:token", resetPassword); // ✅ جديد

export default router;
