// middleware/authMiddleware.js
const { verifyToken } = require("../utils/jwtHelper");
const User = require("../models/User"); // Our SQLite User model

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = verifyToken(token);

      if (!decoded || !decoded.id) {
        // Check if decoded and decoded.id exist
        return res.status(401).json({ message: "Not authorized, token failed" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      req.user = user; // Attach user object to request
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
