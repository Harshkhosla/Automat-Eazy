const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT and protect routes
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get current user's data
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authMiddleware, getCurrentUser };
