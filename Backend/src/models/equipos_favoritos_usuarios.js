const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FavoriteTeam = sequelize.define('FavoriteTeam', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
  team_id: { type: DataTypes.INTEGER, references: { model: 'teams', key: 'id' } }
}, { tableName: 'favorite_teams' });

module.exports = FavoriteTeam;
