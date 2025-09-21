const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization header' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { user_id: decoded.user_id } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = {
      user_id: user.user_id,
      role: user.role,
      name: user.name,
      email: user.email,
      course: user.course,
      gpa: user.gpa,
      location: user.location,
      preferred_fields: user.preferred_fields
    };
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  next();
};

module.exports = { authMiddleware, adminOnly };
