// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const authMiddleware = require("../middlewares/authMiddleware"); // حماية route (تأكد من تسجيل الدخول)

// 1. إرسال رسالة
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id; // جاي من authMiddleware

    if (!receiverId || !text) return res.status(400).json({ msg: "All fields required" });

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// 2. جلب الرسائل بين مستخدمين (conversation)
router.get("/messages/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    // نجيب الرسائل اللي بين هاد الجوج
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ createdAt: 1 }); // ترتيب زمني

    res.json(messages);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// 3. جلب لائحة المحادثات (آخر رسالة لكل محادثة)
router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate pipeline باش نجيب آخر رسالة لكل محادثة مع user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$receiver",
              "$sender",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          username: "$user.username",
          lastMessage: "$lastMessage.text",
          createdAt: "$lastMessage.createdAt",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
