import jwt from 'jsonwebtoken';

//  verify token
export function verifyToken(req, res, next) {
  const authToken = req.headers.authorization; // ← تصحيح: headers بدل header
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res.status(401).json({ message: "invalid token, access denied" });
    }
  } else {
    return res.status(401).json({ message: "no token provided, access denied" });
  }
}

// verify token and admin
export function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Not allowed, only admin" });
    }
  });
}

// verify token and user
export function verifyTokenAndOnlyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: "Not allowed, user" });
    }
  });
}

// Access only user himself or admin
export function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied: Only owner or admin can delete this account" });
    }
  });
}
