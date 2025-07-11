// middlewares/authSocket.js
const jwt = require("jsonwebtoken");

const verifySocketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // ✅ بدلها بالـ secret ديالك
    socket.user = {
      id: decoded.id,
      username: decoded.username,
    };
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
};

module.exports = verifySocketAuth;
