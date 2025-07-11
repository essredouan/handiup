import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, validateRegisterUser, validateLoginUser } from '../models/User.js';
import asyncHandler from 'express-async-handler';
import { sendResetEmail } from '../utils/email.js'; // ✅ جديد

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
    role: req.body.role, // ✅ Fix: Include role to avoid validation error
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

  // Generate token from models/User.js method (optional)
  // const token = user.generateAuthToken();
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin, role: user.role }, // ✅ include role here
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    role: user.role, // ✅ include role in response
    token,
  });
});

// ====== Forgot Password ======
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_RESET_SECRET,
    { expiresIn: process.env.JWT_RESET_EXPIRES || "15m" }
  );

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  try {
    await sendResetEmail(user.email, resetLink);
    res.status(200).json({ message: "Reset email sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send email" });
  }
});

// ====== Reset Password ======
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) return res.status(400).json({ message: "Password required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});
