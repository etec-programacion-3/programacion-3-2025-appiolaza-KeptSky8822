const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Match = require('./partido');   // Para referencia
// Suponiendo que también tengas Player y Team
const Player = require('./jugador');
const Team = require('./equipo');

const MatchEvent = sequelize.define('MatchEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  match_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'matches',
      key: 'id'
    }
  },
  player_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'players',
      key: 'id'
    }
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id'
    }
  },
  minute: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Minuto del partido en el que ocurrió el evento'
  },
  event_type: {
    type: DataTypes.ENUM,
    values: ['GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION', 'OWN_GOAL', 'PENALTY_MISSED', 'VAR_DECISION', 'PENALTY_SCORED', 'OFFSIDE', 'SUBSTITUTION_IN', 'SUBSTITUTION_OUT', 'INJURY', 'SECOND_YELLOW_CARD'],
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Descripción opcional del evento'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_updated: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Última actualización desde API externa'
  }
}, {
  tableName: 'match_events',
  indexes: [
    { fields: ['match_id'] },
    { fields: ['player_id'] },
    { fields: ['team_id'] },
    { fields: ['event_type'] },
    { fields: ['minute'] }
  ]
});

// Relaciones
Match.hasMany(MatchEvent, { foreignKey: 'match_id' });
MatchEvent.belongsTo(Match, { foreignKey: 'match_id' });

Player.hasMany(MatchEvent, { foreignKey: 'player_id' });
MatchEvent.belongsTo(Player, { foreignKey: 'player_id' });

Team.hasMany(MatchEvent, { foreignKey: 'team_id' });
MatchEvent.belongsTo(Team, { foreignKey: 'team_id' });

module.exports = MatchEvent;
