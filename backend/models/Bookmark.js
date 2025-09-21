const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Scholarship = require('./Scholarship');

const Bookmark = sequelize.define('Bookmark', {
  bookmark_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  }
}, {
  tableName: 'bookmarks',
  timestamps: true,
});


User.hasMany(Bookmark, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Bookmark.belongsTo(User, { foreignKey: 'user_id' });

Scholarship.hasMany(Bookmark, { foreignKey: 'scholarship_id', onDelete: 'CASCADE' });
Bookmark.belongsTo(Scholarship, { foreignKey: 'scholarship_id' });

module.exports = Bookmark;
