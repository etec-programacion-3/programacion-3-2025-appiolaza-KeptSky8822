const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Competition = sequelize.define('Competition', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  country: { type: DataTypes.STRING(50) },
  type: { type: DataTypes.ENUM('league','cup','friendly'), allowNull: false },
  season: { type: DataTypes.STRING(20) }
}, { tableName: 'competitions' });

module.exports = Competition;
