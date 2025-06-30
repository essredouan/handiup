import express from "express";
import {
  createCommentCtrl,
  getCommentsByPostCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
} from "../controllers/commentsController.js";

import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../middleware/verifyToken.js";

import validateObjectid from "../middleware/validateObjectid.js";

const router = express.Router();

// Create comment - فقط المستخدمين مسجلين
router.post("/", verifyToken, createCommentCtrl);

// Get comments by post id - متاح للجميع
router.get("/post/:postId",verifyToken, validateObjectid, getCommentsByPostCtrl);

// Update comment - فقط صاحب التعليق أو admin
router.put("/:id",verifyToken,validateObjectid, updateCommentCtrl);

// Delete comment - فقط صاحب التعليق أو admin
router.delete("/:id",verifyToken, validateObjectid, deleteCommentCtrl);

export default router;
