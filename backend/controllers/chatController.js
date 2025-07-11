require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Chat controller connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

async function joinRoom(socket, { senderId, receiverId }) {
  try {
    // Validate users exist
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);

    if (!sender || !receiver) {
      throw new Error('One or both users not found');
    }

    const roomId = generateRoomId(senderId, receiverId);
    socket.join(roomId);
    socket.roomId = roomId;
    
    // Load last 50 messages
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('sender', 'username profilePhoto');

    console.log(`${sender.username} joined chat with ${receiver.username}`);
    
    // Send room info and messages to the joining user
    socket.emit('roomJoined', {
      roomId,
      receiver: {
        id: receiver._id,
        username: receiver.username,
        profilePhoto: receiver.profilePhoto
      },
      messages: messages.reverse() // Show oldest first
    });

    return { success: true, roomId };
  } catch (error) {
    console.error('Error joining room:', error);
    socket.emit('chatError', { 
      message: 'Failed to join chat room',
      error: error.message
    });
    return { success: false, error: error.message };
  }
}

async function sendPrivateMessage(io, socket, { senderId, receiverId, content }) {
  try {
    // Validate input
    if (!senderId || !receiverId || !content) {
      throw new Error('Missing required fields');
    }

    const roomId = generateRoomId(senderId, receiverId);
    
    // Create and save message
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content
    });

    await newMessage.save();

    // Populate sender info
    const messageWithSender = await Message.populate(newMessage, {
      path: 'sender',
      select: 'username profilePhoto'
    });

    // Prepare message data
    const messageData = {
      id: messageWithSender._id,
      content: messageWithSender.content,
      createdAt: messageWithSender.createdAt,
      sender: {
        id: messageWithSender.sender._id,
        username: messageWithSender.sender.username,
        profilePhoto: messageWithSender.sender.profilePhoto
      },
      receiver: receiverId
    };

    // Send to room
    io.to(roomId).emit('newMessage', messageData);
    
    // Update last message timestamps
    await Promise.all([
      User.findByIdAndUpdate(senderId, { lastMessageAt: new Date() }),
      User.findByIdAndUpdate(receiverId, { 
        lastMessageAt: new Date(),
        $addToSet: { unreadMessages: newMessage._id }
      })
    ]);

    console.log(`Message sent from ${senderId} to ${receiverId}`);
    return { success: true, message: messageData };
  } catch (error) {
    console.error('Error sending message:', error);
    socket.emit('chatError', { 
      message: 'Failed to send message',
      error: error.message
    });
    return { success: false, error: error.message };
  }
}

async function markMessagesAsRead(socket, { userId, messageIds }) {
  try {
    await Message.updateMany(
      { 
        _id: { $in: messageIds },
        receiver: userId,
        read: false 
      },
      { $set: { read: true } }
    );

    await User.findByIdAndUpdate(userId, {
      $pull: { unreadMessages: { $in: messageIds } }
    });

    socket.emit('messagesRead', { messageIds });
    return { success: true };
  } catch (error) {
    console.error('Error marking messages as read:', error);
    socket.emit('chatError', {
      message: 'Failed to mark messages as read',
      error: error.message
    });
    return { success: false, error: error.message };
  }
}

function generateRoomId(user1, user2) {
  return [user1.toString(), user2.toString()].sort().join('-');
}

function handleDisconnect(socket) {
  if (socket.roomId) {
    console.log(`User disconnected from room ${socket.roomId}`);
    socket.leave(socket.roomId);
  }
}

module.exports = {
  joinRoom,
  sendPrivateMessage,
  markMessagesAsRead,
  handleDisconnect
};