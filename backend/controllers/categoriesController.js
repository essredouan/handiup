import asyncHandler from "express-async-handler";
import { Category, validateCreateCategory } from "../models/Category.js";

// ✅ إنشاء تصنيف جديد
// POST /api/categories
// Private (خاص بالمستخدم المسجل)
export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newCategory = new Category({
    user: req.user.id,
    title: req.body.title,
  });

  await newCategory.save();
  res.status(201).json({ message: "Category created successfully", category: newCategory });
});

// ✅ جلب جميع التصنيفات الخاصة بالمستخدم
// GET /api/categories
// Private
export const getUserCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(categories);
});

// ✅ حذف تصنيف
// DELETE /api/categories/:id
// Private
export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  if (category.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  await category.deleteOne();
  res.status(200).json({ message: "Category deleted successfully" });
});
