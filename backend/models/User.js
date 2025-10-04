const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  course: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  gpa: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  preferred_fields: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    allowNull: false,
    defaultValue: 'student',
  },
  full_name: DataTypes.STRING,
  birth_date: DataTypes.DATE,
  gender: DataTypes.STRING,
  address_region: DataTypes.STRING,
  address_province: DataTypes.STRING,
  address_city: DataTypes.STRING,
  contact_number: DataTypes.STRING,
  school: DataTypes.STRING,
  year_level: DataTypes.STRING,
  strand_or_course: DataTypes.STRING,
  academic_awards: DataTypes.TEXT,
  parents_occupation: DataTypes.STRING,
  parents_education: DataTypes.STRING,
  household_income_range: DataTypes.STRING,
  siblings_in_school: DataTypes.INTEGER,
  field_of_interest: DataTypes.TEXT,
  leadership_experience: DataTypes.TEXT,
  volunteer_work: DataTypes.TEXT,
  special_skills: DataTypes.TEXT,
  special_sector_membership: DataTypes.TEXT
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
