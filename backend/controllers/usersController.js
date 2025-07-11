import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { User, validateUpdateUser } from '../models/User.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import { cloudinaryUploadImage, cloudinaryRemoveImage } from "../utils/cloudinary.js";
import { fileURLToPath } from 'url';
import fs from 'fs';
import Post from "../models/post.js";
import CommentObj from "../models/Comment.js";
import Message from "../models/Message.js";
const { Comment } = CommentObj;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all users (Admin only)
export const getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("posts");
  res.status(200).json(users);
});

// Get one user (by id or self)
export const getUserProfileCtrl = asyncHandler(async (req, res) => {
  const userId = req.params.id || req.user.id;
  const user = await User.findById(userId).select("-password").populate("posts");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});

// Update user profile (only user itself or admin)
export const updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check authorization: user can update only their own profile or if admin
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ message: "Not authorized to update this profile" });
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
        bio: req.body.bio,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        password: req.body.password,
        role: req.body.role,
      }
    },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(updatedUser);
});

// Get users count
export const getUsersCountCtrl = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json(count);
});

// Profile photo upload
export const profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
  const user = await User.findById(req.user.id);

  if (user.profilePhoto?.publicId) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  await user.save();

  res.status(200).json({ 
    message: "Your profile photo uploaded",   
    profilePhoto: { url: result.secure_url, publicId: result.public_id }
  });

  fs.unlinkSync(imagePath);
});

// Delete user account
export const deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const posts = await Post.find({ user: user._id });
  const publicIds = posts.map(post => post.image?.publicId).filter(Boolean);

  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });

  for (const publicId of publicIds) {
    await cloudinaryRemoveImage(publicId);
  }

  if (user.profilePhoto?.publicId) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "User account has been deleted" });
});

// Get chat messages between two users
export const getChatMessagesCtrl = asyncHandler(async (req, res) => {
  const { otherUserId } = req.params;
  const myUserId = req.user.id;

  const messages = await Message.find({
    $or: [
      { sender: myUserId, receiver: otherUserId },
      { sender: otherUserId, receiver: myUserId },
    ]
  }).sort({ createdAt: 1 });

  res.status(200).json(messages);
});

// Get user conversations (latest message per conversation)
export const getUserConversationsCtrl = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: new mongoose.Types.ObjectId(userId) },
          { receiver: new mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
            '$receiver',
            '$sender'
          ]
        },
        lastMessage: { $first: '$$ROOT' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$user._id',
        username: '$user.username',
        lastMessage: '$lastMessage.content',
        createdAt: '$lastMessage.createdAt'
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  res.status(200).json(conversations);
});

// Mark messages as read between users
export const markMessagesAsReadCtrl = asyncHandler(async (req, res) => {
  const myUserId = req.user.id;
  const { otherUserId } = req.params;

  await Message.updateMany(
    {
      sender: otherUserId,
      receiver: myUserId,
      read: false
    },
    {
      $set: { read: true }
    }
  );

  res.status(200).json({ message: "Messages marked as read" });
});

// Search users by username
export const searchUsersCtrl = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  const users = await User.find({
    username: { $regex: query, $options: 'i' }
  }).select("-password").limit(10);

  res.status(200).json(users);
});

// Send a message
export const sendMessageCtrl = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ message: "receiverId and content are required" });
  }

  const newMessage = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content,
    read: false,
  });

  res.status(201).json(newMessage);
});
