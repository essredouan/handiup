import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import usersRoutes from "./routes/usersRoute.js";
import postsRoutes from "./routes/postsRoute.js";
import commentsRoutes from "./routes/commentsRoute.js";
import categoriesRoutes from "./routes/categoriesRoute.js";
import { notFound, errorHandler } from './middleware/error.js';
import Message from "./models/Message.js";
import { User } from "./models/User.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // انضمام المستخدم لغرفة محادثة خاصة بينه وبين مستخدم آخر
  socket.on("joinRoom", async ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    socket.join(roomId);
    console.log(`User ${senderId} joined room ${roomId}`);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    try {
      // حالة الرسالة العامة - تبعث لجميع المتصلين بدون تخزين في DB
      if (receiverId === "all") {
        io.emit("newMessage", {
          sender: senderId,
          receiver: "all",
          content,
          createdAt: new Date()
        });
        return;
      }

      // حالة الرسالة الخاصة - تخزين وإرسال في الغرفة الخاصة
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content
      });

      await message.save();

      const populatedMessage = await Message.populate(message, {
        path: "sender",
        select: "username profilePhoto"
      });

      const roomId = [senderId, receiverId].sort().join("-");
      io.to(roomId).emit("newMessage", populatedMessage);

      await Promise.all([
        User.findByIdAndUpdate(senderId, { lastMessageAt: new Date() }),
        User.findByIdAndUpdate(receiverId, { 
          lastMessageAt: new Date(),
          $addToSet: { unreadMessages: message._id }
        })
      ]);
    } catch (error) {
      console.error("Socket message error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/categories", categoriesRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
