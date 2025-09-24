const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PlayerStatistics = sequelize.define('PlayerStatistics', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  player_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { 
      model: 'players', 
      key: 'id' 
    } 
  },
  season: { 
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Temporada (ej: 2023-24, 2024-25)'
  },
  games_played: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  goals: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  assists: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  yellow_cards: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  red_cards: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  minutes_played: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Campo virtual para calcular goles + asistencias
  goal_contributions: {
    type: DataTypes.VIRTUAL,
    get() {
      return (this.goals || 0) + (this.assists || 0);
    }
  },
  // Campo virtual para promedio de goles por partido
  goals_per_game: {
    type: DataTypes.VIRTUAL,
    get() {
      if (this.games_played > 0) {
        return Math.round((this.goals / this.games_played) * 100) / 100;
      }
      return 0;
    }
  },
  // Campo virtual para promedio de tarjetas por partido
  cards_per_game: {
    type: DataTypes.VIRTUAL,
    get() {
      if (this.games_played > 0) {
        const totalCards = (this.yellow_cards || 0) + (this.red_cards || 0);
        return Math.round((totalCards / this.games_played) * 100) / 100;
      }
      return 0;
    }
  }
}, { 
  tableName: 'player_statistics',
  indexes: [
    // Índice único para evitar duplicados de jugador-temporada
    {
      unique: true,
      fields: ['player_id', 'season']
    },
    // Índice para consultas por temporada
    {
      fields: ['season']
    }
  ]
});

module.exports = PlayerStatistics;