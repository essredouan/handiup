import { Server } from 'socket.io';
import Message from '../models/Message.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication error');
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      socket.userId = user._id;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    socket.on('joinRoom', async (receiverId) => {
      const roomId = [socket.userId, receiverId].sort().join('-');
      socket.join(roomId);
      console.log(`User ${socket.userId} joined room ${roomId}`);
    });

    socket.on('sendMessage', async ({ receiverId, content }) => {
      try {
        const message = new Message({
          sender: socket.userId,
          receiver: receiverId,
          content
        });

        await message.save();

        const populatedMessage = await Message.populate(message, {
          path: 'sender',
          select: 'username profilePhoto'
        });

        const roomId = [socket.userId, receiverId].sort().join('-');
        io.to(roomId).emit('newMessage', populatedMessage);

        // Update last message timestamps
        await Promise.all([
          User.findByIdAndUpdate(socket.userId, { lastMessageAt: new Date() }),
          User.findByIdAndUpdate(receiverId, { 
            lastMessageAt: new Date(),
            $addToSet: { unreadMessages: message._id }
          })
        ]);
      } catch (error) {
        console.error('Socket message error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

export default initSocketServer;