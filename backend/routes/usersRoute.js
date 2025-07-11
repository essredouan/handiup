import express from "express";
import {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  profilePhotoUploadCtrl,
  deleteUserProfileCtrl,
  getUsersCountCtrl,
  getUserConversationsCtrl,
  getChatMessagesCtrl,
  sendMessageCtrl,
  searchUsersCtrl,
  markMessagesAsReadCtrl
} from "../controllers/usersController.js";
import photoUpload from "../middleware/photoUpload.js";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../middleware/verifyToken.js";

const router = express.Router();

// عدد المستخدمين - Admin فقط
router.get("/count/all", verifyTokenAndAdmin, getUsersCountCtrl);

// رفع صورة البروفايل
router.post(
  "/profile-photo-upload",
  verifyToken,
  photoUpload.single("image"),
  profilePhotoUploadCtrl
);

// الحصول على بروفايل المستخدم الحالي
router.get("/profile", verifyToken, getUserProfileCtrl);

// جميع المستخدمين - Admin فقط
router.get("/", verifyTokenAndAdmin, getAllUsersCtrl);

// جلب بروفايل مستخدم معين - أي مستخدم مسجل دخول يقدر يشوف
router.get("/:id", verifyToken, getUserProfileCtrl);

// تحديث بروفايل - المستخدم نفسه فقط
router.put("/:id", verifyTokenAndAuthorization, updateUserProfileCtrl);

// حذف حساب المستخدم - المستخدم نفسه فقط أو Admin
router.delete("/:id", verifyTokenAndAuthorization, deleteUserProfileCtrl);

// المحادثات
router.get("/conversations/all", verifyToken, getUserConversationsCtrl);

// رسائل محادثة معينة (تم توحيد اسم الـ param)
router.get("/messages/:otherUserId", verifyToken, getChatMessagesCtrl);

// إرسال رسالة
router.post("/messages/send", verifyToken, sendMessageCtrl);

// البحث عن مستخدمين
router.get("/search/users", verifyToken, searchUsersCtrl);

// تحديد الرسائل كمقروءة (تم إضافة param otherUserId)
router.put("/messages/mark-read/:otherUserId", verifyToken, markMessagesAsReadCtrl);

export default router;
