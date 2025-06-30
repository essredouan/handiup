import asyncHandler from 'express-async-handler';
import { User, validateUpdateUser } from '../models/User.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import { cloudinaryUploadImage, cloudinaryRemoveImage } from "../utils/cloudinary.js";
import { fileURLToPath } from 'url'; // ✅ مضاف لتعريف __dirname
import fs from 'fs';  // delete photo from system
import Post from "../models/post.js";
import CommentObj from "../models/Comment.js";
const { Comment } = CommentObj;

const __filename = fileURLToPath(import.meta.url);   // ✅
const __dirname = path.dirname(__filename);          // ✅

// Get all users (Admin only)
export const getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("posts");
  res.status(200).json(users);
});

// Get one user
export const getUserProfileCtrl = asyncHandler(async (req, res) => {
  // استعمل إما id من params أو id ديال المستخدم من التوكن
  const userId = req.params.id || req.user.id;

  const user = await User.findById(userId).select("-password").populate("posts");
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  res.status(200).json(user);
});

// update user profile only user
export const updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio
      }
    },
    { new: true }
  ).select("-password");

  res.status(200).json(updatedUser);
});

// get users count
export const getUsersCountCtrl = asyncHandler(async (req, res) => {
  const count = await User.count();
  res.status(200).json(count);
});

// profile photo upload
export const profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "no file provided" });
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  // upload to cloudinary
  const result = await cloudinaryUploadImage(imagePath);
 
  // get the user from db
  const user = await User.findById(req.user.id);

  // delete the old prfl photo from db if exist
  if (user.profilePhoto.publicId !== null){
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  // change the profile photo in the db
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  await user.save();

  // جواب user
  res.status(200).json({ 
    message: "your profile photo uploaded",   
    profilePhoto: { url: result.secure_url, publicId: result.public_id }
  });

  // remove image from img folder
  fs.unlinkSync(imagePath);
});

// Delete user account
// Route: DELETE /api/users/profile/:id
// Access: Private (User or Admin)
export const deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  // 1. جلب المستخدم من قاعدة البيانات عن طريق ID فـ params
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // ✅ Get all posts from db
  const posts = await Post.find({ user: user._id });

  // ✅ Get the public ids from the posts
  const publicIds = posts.map(post => post.image?.publicId).filter(Boolean);

  // ✅ Delete all posts from DB
  await Post.deleteMany({ user: user._id });

  // ✅ Delete all comments made by the user
  await Comment.deleteMany({ user: user._id });

  // ✅ Delete images from Cloudinary
  for (const publicId of publicIds) {
    await cloudinaryRemoveImage(publicId);
  }

  // 2. إذا عندو صورة بروفايل نحيدوها من Cloudinary
  if (user.profilePhoto && user.profilePhoto.publicId) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  // 3. نحيد المستخدم من قاعدة البيانات
  await User.findByIdAndDelete(req.params.id);

  // 4. نردو جواب النجاح
  res.status(200).json({ message: "User account has been deleted" });
});
