import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const SERVER_URL = "http://localhost:5000"; // ولا الرابط ديال backend ديالك

const socket = io(SERVER_URL, {
  autoConnect: false,
});

function ChatApp({ currentUserId, token }) {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch conversations once logged in
  useEffect(() => {
    if (!token) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/chat/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchConversations();
  }, [token]);

  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (!selectedUser || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/chat/messages/${selectedUser.userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, [selectedUser, token]);

  // Setup socket connection and events
  useEffect(() => {
    if (!token) return;

    socket.auth = { token };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Join room when selectedUser changes
  useEffect(() => {
    if (!selectedUser) return;

    socket.emit("joinRoom", { senderId: currentUserId, receiverId: selectedUser.userId });
  }, [selectedUser, currentUserId]);

  // Listen to new messages via socket
  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (
        (message.sender._id === selectedUser?.userId && message.receiver === currentUserId) ||
        (message.receiver === selectedUser?.userId && message.sender._id === currentUserId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedUser, currentUserId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send new message handler
  const handleSendMessage = async () => {
    if (!newMsg.trim() || !selectedUser) return;

    const msgData = {
      senderId: currentUserId,
      receiverId: selectedUser.userId,
      content: newMsg.trim(),
    };

    socket.emit("sendMessage", msgData);

    setMessages((prev) => [
      ...prev,
      {
        ...msgData,
        sender: { _id: currentUserId, username: "You" }, // Optionally add more info here
        createdAt: new Date(),
      },
    ]);

    setNewMsg("");
  };

  return (
    <div style={{ display: "flex", height: "80vh", border: "1px solid #ccc" }}>
      {/* Sidebar: Conversations */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc", overflowY: "auto" }}>
        <h3 style={{ textAlign: "center" }}>Conversations</h3>
        {conversations.length === 0 && <p>No conversations found</p>}
        {conversations.map((conv) => (
          <div
            key={conv.userId}
            onClick={() => setSelectedUser(conv)}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: selectedUser?.userId === conv.userId ? "#ddd" : "transparent",
              borderBottom: "1px solid #ccc",
            }}
          >
            <strong>{conv.username}</strong>
            <p style={{ fontSize: "0.9em", color: "#555", margin: "5px 0" }}>
              {conv.lastMessage.length > 30
                ? conv.lastMessage.substring(0, 30) + "..."
                : conv.lastMessage}
            </p>
          </div>
        ))}
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Chat header */}
        <div
          style={{
            padding: "10px",
            borderBottom: "1px solid #ccc",
            backgroundColor: "#f0f0f0",
          }}
        >
          <h4>{selectedUser ? selectedUser.username : "Select a conversation"}</h4>
        </div>

        {/* Messages list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "#fafafa",
          }}
        >
          {messages.length === 0 && <p>No messages</p>}
          {messages.map((msg, index) => {
            const isMe = msg.sender._id === currentUserId || msg.sender === currentUserId;
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    maxWidth: "60%",
                    padding: "10px",
                    borderRadius: "15px",
                    backgroundColor: isMe ? "#007bff" : "#e5e5ea",
                    color: isMe ? "white" : "black",
                    wordBreak: "break-word",
                  }}
                >
                  <div style={{ fontSize: "0.8em", marginBottom: "5px" }}>
                    {isMe ? "You" : msg.sender.username || "Unknown"}
                  </div>
                  {msg.content}
                  <div style={{ fontSize: "0.7em", color: "#999", marginTop: "5px", textAlign: "right" }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div style={{ padding: "10px", borderTop: "1px solid #ccc", display: "flex" }}>
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => { if(e.key === "Enter") handleSendMessage(); }}
            placeholder="Type your message..."
            style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }}
          />
          <button onClick={handleSendMessage} style={{ marginLeft: "10px", padding: "10px 20px", borderRadius: "20px" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
