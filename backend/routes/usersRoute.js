import express from "express";
import {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  profilePhotoUploadCtrl,
  deleteUserProfileCtrl,
  getUsersCountCtrl,
} from "../controllers/usersController.js";
import photoUpload from "../middleware/photoUpload.js";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ عدد المستخدمين - Admin فقط
router.get("/count/all", verifyTokenAndAdmin, getUsersCountCtrl);

// ✅ رفع صورة البروفايل
router.post(
  "/profile-photo-upload",
  verifyToken,
  photoUpload.single("image"),
  profilePhotoUploadCtrl
);

// ✅ ⬅️ إضافة هذا السطر لحل المشكل
router.get("/profile", verifyToken, getUserProfileCtrl);

// ✅ جميع المستخدمين - Admin فقط
router.get("/", verifyTokenAndAdmin, getAllUsersCtrl);

// ✅ مستخدم معين - متاح للجميع
router.get("/:id", verifyToken,verifyTokenAndAuthorization,getUserProfileCtrl);

// ✅ تحديث البروفايل - المستخدم نفسه فقط
router.put("/:id", verifyTokenAndAuthorization, updateUserProfileCtrl);

// ✅ حذف حساب المستخدم - المستخدم نفسه أو Admin
router.delete("/:id", verifyToken, deleteUserProfileCtrl);

export default router;
