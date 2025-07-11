import express from "express";
import {
  createPostCtrl,
  getAllPostsCtrl,
  getPostByIdCtrl,
  updatePostCtrl,
  deletePostCtrl,
  getPostsCountCtrl,
  toggleLikeCtrl,
  getUserPostsCtrl, // زدت هاد الدالة
} from "../controllers/postsController.js";
import photoUpload from "../middleware/photoUpload.js";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../middleware/verifyToken.js";
import validateObjectid from "../middleware/validateObjectid.js";

const router = express.Router();

// ✅ عدد البوستات - Admin فقط
router.get("/count", verifyTokenAndAdmin, getPostsCountCtrl);

// ✅ لايك أو أنلايك - Logged in user فقط
router.put("/like/:id", validateObjectid, verifyToken, toggleLikeCtrl);

// ✅ جميع البوستات
router.get("/", getAllPostsCtrl);

// ✅ بوست معين حسب ID
router.get("/:id", validateObjectid, getPostByIdCtrl);

// ✅ جلب بوستات المستخدم الحالي
router.get("/user", verifyToken, getUserPostsCtrl);

// ✅ إنشاء بوست جديد
router.post(
  "/",
  verifyToken,
  photoUpload.single("image"),
  createPostCtrl
);

// ✅ تعديل بوست
router.put(
  "/:id",
  validateObjectid,
  verifyToken,
  photoUpload.single("image"),
  updatePostCtrl
);

// ✅ حذف بوست
router.delete("/:id", validateObjectid, verifyToken, deletePostCtrl);

export default router;
