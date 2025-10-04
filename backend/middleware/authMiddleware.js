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
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.course,
      gpa: user.gpa,
      location: user.location,
      preferred_fields: user.preferred_fields,
      full_name: user.full_name,
      birth_date: user.birth_date,
      gender: user.gender,
      address_region: user.address_region,
      address_province: user.address_province,
      address_city: user.address_city,
      contact_number: user.contact_number,
      school: user.school,
      year_level: user.year_level,
      strand_or_course: user.strand_or_course,
      academic_awards: user.academic_awards,
      parents_occupation: user.parents_occupation,
      parents_education: user.parents_education,
      household_income_range: user.household_income_range,
      siblings_in_school: user.siblings_in_school,
      field_of_interest: user.field_of_interest,
      leadership_experience: user.leadership_experience,
      volunteer_work: user.volunteer_work,
      special_skills: user.special_skills,
      special_sector_membership: user.special_sector_membership
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
