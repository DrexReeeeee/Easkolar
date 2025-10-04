const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Signup
exports.signup = async (req, res) => {
  const {
    first_name, last_name, email, password, course, gpa, location, preferred_fields, role,
    full_name, birth_date, gender,
    address_region, address_province, address_city,
    contact_number, school, year_level, strand_or_course,
    academic_awards, parents_occupation, parents_education,
    household_income_range, siblings_in_school,
    field_of_interest, leadership_experience, volunteer_work,
    special_skills, special_sector_membership
  } = req.body;

  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'First name, last name, email, and password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashed,
      course, gpa, location, preferred_fields,
      role: role === 'admin' ? 'admin' : 'student',
      full_name, birth_date, gender,
      address_region, address_province, address_city,
      contact_number, school, year_level, strand_or_course,
      academic_awards, parents_occupation, parents_education,
      household_income_range, siblings_in_school,
      field_of_interest, leadership_experience, volunteer_work,
      special_skills, special_sector_membership
    });

    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({ token, user });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Logout
exports.logout = async (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ where: { user_id: req.user.user_id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ user });
  } catch (error) {
    console.error('GetProfile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findOne({ where: { user_id: req.user.user_id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) user[key] = req.body[key];
    });

    await user.save();
    return res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
