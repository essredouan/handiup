import express from "express";
import {
  createPostCtrl,
  getAllPostsCtrl,
  getPostByIdCtrl,
  updatePostCtrl,
  deletePostCtrl,
  getPostsCountCtrl,
  toggleLikeCtrl,
  getUserPostsCtrl,
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

// ✅ جلب بوستات المستخدم الحالي
router.get("/myposts", verifyToken, getUserPostsCtrl);

// ✅ بوست معين حسب ID
router.get("/:id", validateObjectid, getPostByIdCtrl);

// ✅ إنشاء بوست جديد
router.post(
  "/",
  verifyToken,
  photoUpload.single("image"),
  createPostCtrl
);

// ✅ تعديل بوست (صاحب البوست أو admin فقط)
router.put(
  "/:id",
  validateObjectid,
  verifyToken,
  photoUpload.single("image"),
  updatePostCtrl
);

// ✅ حذف بوست (صاحب البوست أو admin فقط)
router.delete(
  "/:id",
  validateObjectid,
  verifyToken,
  deletePostCtrl
);

export default router;
