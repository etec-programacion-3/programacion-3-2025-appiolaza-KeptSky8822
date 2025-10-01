const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MatchEvent = sequelize.define('MatchEvent', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  match_id: { type: DataTypes.INTEGER, references: { model: 'matches', key: 'id' } },
  team_id: { type: DataTypes.INTEGER, references: { model: 'teams', key: 'id' } },
  player_id: { type: DataTypes.INTEGER, references: { model: 'players', key: 'id' } },
  type: { type: DataTypes.ENUM('goal','yellow_card','red_card','substitution','penalty'), allowNull: false },
  minute: { type: DataTypes.INTEGER },
  description: { type: DataTypes.STRING(255) }
}, { tableName: 'match_events' });

module.exports = MatchEvent;
