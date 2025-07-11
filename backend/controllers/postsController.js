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

  const { error } = validateCreatePost(req.body);
  if (error) {
    fs.unlinkSync(path.join(process.cwd(), "images", req.file.filename));
    return res.status(400).json({ message: error.details.map((e) => e.message).join(", ") });
  }

  const imagePath = path.join(process.cwd(), "images", req.file.filename);
  const result = await cloudinaryUploadImage(imagePath);

  fs.unlinkSync(imagePath);

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

// جلب بوستات المستخدم الحالي
export const getUserPostsCtrl = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ user: userId }).populate("category", "title");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user posts" });
  }
});

// Get all posts
export const getAllPostsCtrl = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;

  if (pageNumber) {
    posts = await Post.find()
      .populate("user", "username role")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE);
  } else if (category) {
    posts = await Post.find({ category })
      .populate("user", "username role")
      .sort({ createdAt: -1 });
  } else {
    posts = await Post.find()
      .populate("user", "username role")
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

// Delete post (owner or admin)
export const deletePostCtrl = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.user && req.user.id !== post.user.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: "Not authorized to delete this post" });
  }

  if (post.image?.publicId) {
    await cloudinaryRemoveImage(post.image.publicId);
    await Comment.deleteMany({ post: post._id });
  }

  await post.deleteOne();

  res.status(200).json({ message: "Post deleted successfully" });
});

// Get posts count
export const getPostsCountCtrl = asyncHandler(async (req, res) => {
  const count = await Post.countDocuments();
  res.status(200).json({ count });
});

// Update post (owner or admin)
export const updatePostCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (req.user.id !== post.user.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: "Not authorized to update this post" });
  }

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

  res.status(200).json({ updatedPost });
});

// Update post image
export const updatePostImageCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }

  const imagePath = path.join(process.cwd(), "images", req.file.filename);

  const result = await cloudinaryUploadImage(imagePath);

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

// Toggle like/unlike post
export const toggleLikeCtrl = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter(id => id.toString() !== userId.toString());
  } else {
    post.likes.push(userId);
  }

  await post.save();

  res.status(200).json({
    liked: !alreadyLiked,
    message: alreadyLiked ? "Post unliked" : "Post liked",
  });
});
