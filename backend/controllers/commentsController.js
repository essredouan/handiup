import asyncHandler from "express-async-handler";
import CommentObj from "../models/Comment.js";
const { Comment, validateCreateComment, validateUpdateComment } = CommentObj;

import {User} from "../models/User.js"



//creat new comment
// route:   api/comments
//only logged in user

// إنشاء كومنت جديد
export const createCommentCtrl = asyncHandler(async (req, res) => {
  // تحقق من البيانات
  const { error } = validateCreateComment(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const profile = await User.findById(req.user.id);

  const comment = new Comment({
    post: req.body.post,
    user: req.user.id,
    username: profile.username, // فرضنا عندك username فالـ req.user
    text: req.body.text,
  });

  await comment.save();
  res.status(201).json({ message: "Comment created successfully", comment });
});

// جلب جميع الكومنتات لمنشور معين
export const getCommentsByPostCtrl = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username")
    .sort({ createdAt: -1 });
  res.status(200).json(comments);
});

// تحديث كومنت (غير النص)
// المستخدم لازم يكون صاحب الكومنت أو admin (خاص تضيف تحقق الصلاحيات)
export const updateCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateComment(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  // تحقق الصلاحيات (مثلا: if(req.user.id !== comment.user.toString() && !req.user.isAdmin) return forbidden)
  if (req.user.id !== comment.user.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to update this comment" });
  }

  comment.text = req.body.text;
  comment.updatedAt = Date.now();

  await comment.save();
  res.status(200).json({ message: "Comment updated successfully", comment });
});

// حذف كومنت
export const deleteCommentCtrl = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  if (req.user.id !== comment.user.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to delete this comment" });
  }

  await comment.deleteOne();
  res.status(200).json({ message: "Comment deleted successfully" });
});
