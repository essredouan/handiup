import asyncHandler from "express-async-handler";
import Post, { validateCreatePost, validateUpdatePost } from "../models/post.js";
import { cloudinaryUploadImage, cloudinaryRemoveImage } from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";
import CommentObj from "../models/Comment.js";
const { Comment } = CommentObj;

// Create new post
export const createPostCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  // Validate data before uploading image
  const { error } = validateCreatePost(req.body);
  if (error) {
    // Delete uploaded image from server if validation fails
    fs.unlinkSync(path.join(process.cwd(), "images", req.file.filename));
    return res
      .status(400)
      .json({ message: error.details.map((e) => e.message).join(", ") });
  }

  // Upload image to Cloudinary
  const imagePath = path.join(process.cwd(), "images", req.file.filename);
  const result = await cloudinaryUploadImage(imagePath);

  // Remove image from local server
  fs.unlinkSync(imagePath);

  // Create post in DB
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  await post.save();

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
});

// get all posts
// /api/posts
// method get
// access public
export const getAllPostsCtrl = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;

  if (pageNumber) {
    posts = await Post.find()
      .populate("user", "-password")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE);
  } else if (category) {
    posts = await Post.find({ category })
      .populate("user", "-password")
      .sort({ createdAt: -1 });
  } else {
    posts = await Post.find()
      .populate("user", "-password")
      .sort({ createdAt: -1 });
  }

  res.status(200).json(posts);
});

// Get post by ID
export const getPostByIdCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user", "username email");
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(200).json(post);
});

// Delete post
// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Owner or Admin)
export const deletePostCtrl = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  // ⛔ تحقق واش البوست كاين
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // ✅ تحقق من الصلاحيات (صاحب البوست أو admin)
  if (post.user && req.user.id !== post.user.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to delete this post" });
  }

  // 🧹 حذف الصورة من Cloudinary إذا كاينة
  if (post.image?.publicId) {
    await cloudinaryRemoveImage(post.image.publicId);

    // delete all comment that belong to post
    await Comment.deleteMany({post: post._id});
  }

  // 🗑️ حذف البوست
  await post.deleteOne();

  res.status(200).json({ message: "Post deleted successfully" });
});

// delete all comment that belong to post
 
// get all posts
// /api/posts
// method get
// access public
export const getPostsCountCtrl = asyncHandler(async (req, res) => {
  const count = await Post.countDocuments();
  res.status(200).json({ count });
});

//update post
// only owner post
export const updatePostCtrl = asyncHandler(async (req, res) => {
  // Validate data قبل التحديث
  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // جلب البوست اللي بغينا نحدّثوه
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // check if post belong to logged in user OR admin
  if (req.user.id !== post.user.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: "Not authorized to update this post" });
  }

  // تحديث البيانات (إذا موجودة في req.body)
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true }
  ).populate("user", "-password");

  // sent res to client
  res.status(200).json({ updatedPost });
});

// update post image
// api /posts/upload-image/:id
// only logged user
export const updatePostImageCtrl = asyncHandler(async (req, res) => {
    // validation
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }

  const imagePath = path.join(process.cwd(), "images", req.file.filename);

  const result = await cloudinaryUploadImage(imagePath);

  // get the post from db
  const post = await Post.findById(req.params.id);
  if (!post) {
    fs.unlinkSync(imagePath);
    return res.status(404).json({ message: "Post not found" });
  }
  if (req.user.id !== post.user.toString() && !req.user.isAdmin) {
    fs.unlinkSync(imagePath);
    return res.status(403).json({ message: "Not authorized to update post image" });
  }

  if (post.image?.publicId) {
    await cloudinaryRemoveImage(post.image.publicId);
  }

  post.image = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  await post.save();

  fs.unlinkSync(imagePath);

  res.status(200).json({ message: "Post image updated successfully", image: post.image });
});


// toggle like
// @route   PUT /api/posts/like/:id
// @access  Private (only logged in user)
export const toggleLikeCtrl = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  // ⛔ التحقق من وجود البوست
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // ✅ التحقق واش المستخدم دار لايك من قبل
  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    // 🔄 حذف الإعجاب
    post.likes = post.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    // ❤️ إضافة الإعجاب
    post.likes.push(userId);
  }

  await post.save();

  res.status(200).json({
    liked: !alreadyLiked,
    message: alreadyLiked ? "Post unliked" : "Post liked",
  });
});
