const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getUserFromHeader = async (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return User.findById(decoded.id);
};


const protect = async (req, res, next) => {
  try {
    const user = await getUserFromHeader(req);
    if (!user) {
      return res.status(401).json({ message: "Not authorized, no valid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};


const optionalAuth = async (req, res, next) => {
  try {
    req.user = await getUserFromHeader(req);
  } catch (error) {
    req.user = null;
  }
  next();
};

module.exports = { protect, optionalAuth };