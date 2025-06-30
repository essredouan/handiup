import express from "express";
import {
  createCategoryCtrl,
  getUserCategoriesCtrl,
  deleteCategoryCtrl,
} from "../controllers/categoriesController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createCategoryCtrl);
router.get("/", verifyToken, getUserCategoriesCtrl);
router.delete("/:id", verifyToken, deleteCategoryCtrl);

export default router;
