const jwt = require('jsonwebtoken');
const User = require('../models/User.model');


// =========================
// 🔐 GENERATE TOKEN
// =========================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role   // 👈 MUST ADD
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


// =========================
// 🔒 PROTECT MIDDLEWARE
// =========================
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    req.user = user; // includes role from DB
    next();

  } catch (error) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }
};


// =========================
// 👑 ADMIN ONLY MIDDLEWARE
// =========================
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      error: 'Admin access required'
    });
  }
};


// =========================
// 🚀 EXPORT
// =========================
module.exports = {
  generateToken,
  protect,
  adminOnly
};
