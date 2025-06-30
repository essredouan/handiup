// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, validateRegisterUser, validateLoginUser } from '../models/User.js';
import asyncHandler from 'express-async-handler';

// ====== Register Controller ======
export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check if user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "user already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Save user
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  await user.save();

  res.status(201).json({ message: 'You registered successfully, please log in.' });
});

// ====== Login Controller ======
export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Compare password
  const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Generate token f models user.js
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
//  jawb client
  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
  });
});
