const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Scholarship = sequelize.define('Scholarship', {
  scholarship_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  eligibility: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  website_link: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  registration_link: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: 'scholarships',
  timestamps: true,
});

module.exports = Scholarship;
