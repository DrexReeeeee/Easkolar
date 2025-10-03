const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

//Signup
exports.signup = async (req, res) => {
  const { name, email, password, course, gpa, location, preferred_fields, role } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      course: course || null,
      gpa: gpa || null,
      location: location || null,
      preferred_fields: preferred_fields || null,
      role: role === 'admin' ? 'admin' : 'student'  
    });
    const token = jwt.sign(
  { userId: User.user_id },
  process.env.JWT_SECRET,
  { expiresIn: '1h' } 
);
    return res.status(201).json({
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        gpa: user.gpa,
        location: user.location,
        preferred_fields: user.preferred_fields
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

//Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        gpa: user.gpa,
        location: user.location,
        preferred_fields: user.preferred_fields
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

//Logout
exports.logout = async (req, res) => {
  // For JWT, usually the frontend js deletes token.
  // we can implement "blacklist" but for now let's use this:
  return res.status(200).json({ message: 'Logged out successfully' });
};

// GET profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ where: { user_id: req.user.user_id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        gpa: user.gpa,
        location: user.location,
        preferred_fields: user.preferred_fields
      }
    });
  } catch (error) {
    console.error('GetProfile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT(edirt) profile
exports.updateProfile = async (req, res) => {
  const { name, course, gpa, location, preferred_fields } = req.body;
  try {
    const user = await User.findOne({ where: { user_id: req.user.user_id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = name !== undefined ? name : user.name;
    user.course = course !== undefined ? course : user.course;
    user.gpa = gpa !== undefined ? gpa : user.gpa;
    user.location = location !== undefined ? location : user.location;
    user.preferred_fields = preferred_fields !== undefined ? preferred_fields : user.preferred_fields;

    await user.save();

    return res.status(200).json({
      message: 'Profile updated',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        gpa: user.gpa,
        location: user.location,
        preferred_fields: user.preferred_fields
      }
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
