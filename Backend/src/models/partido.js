const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  match_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  matchday: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Jornada de la competición'
  },
  status: {
    type: DataTypes.ENUM,
    values: ['scheduled', 'live', 'halftime', 'finished', 'postponed', 'cancelled'],
    allowNull: false,
    defaultValue: 'scheduled'
  },
  minute: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Minuto actual del partido'
  },
  // Resultados
  home_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  away_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  home_score_halftime: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  away_score_halftime: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  home_score_fulltime: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  away_score_fulltime: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // Información del estadio
  venue: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  attendance: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // Árbitro
  referee: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  // Información adicional
  temperature: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Temperatura en Celsius'
  },
  weather: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  // Estadísticas básicas
  home_possession: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  away_possession: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  home_shots: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  away_shots: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  home_shots_on_target: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  away_shots_on_target: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  home_corners: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  away_corners: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  home_fouls: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  away_fouls: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  home_yellow_cards: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  away_yellow_cards: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  home_red_cards: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  away_red_cards: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  // Meta información
  external_id: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  live_data_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL para datos en vivo'
  },
  // Referencias foráneas
  competition_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'competitions',
      key: 'id'
    }
  },
  home_team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id'
    }
  },
  away_team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id'
    }
  }
}, {
  tableName: 'matches',
  indexes: [
    { fields: ['match_date'] },
    { fields: ['competition_id'] },
    { fields: ['home_team_id'] },
    { fields: ['away_team_id'] },
    { fields: ['status'] },
    { fields: ['matchday'] },
    { fields: ['external_id'] }
  ],
  hooks: {
    beforeSave: (match) => {
      // Validar que home_team_id != away_team_id
      if (match.home_team_id === match.away_team_id) {
        throw new Error('Un equipo no puede jugar contra sí mismo');
      }
      
      // Validar posesión total = 100%
      if (match.home_possession && match.away_possession) {
        if (match.home_possession + match.away_possession !== 100) {
          throw new Error('La suma de posesión debe ser 100%');
        }
      }
    }
  }
});

// Métodos de instancia
Match.prototype.isLive = function() {
  return ['live', 'halftime'].includes(this.status);
};

Match.prototype.isFinished = function() {
  return this.status === 'finished';
};

Match.prototype.getResult = function() {
  if (!this.isFinished()) return null;
  
  if (this.home_score > this.away_score) return 'home_win';
  if (this.away_score > this.home_score) return 'away_win';
  return 'draw';
};

Match.prototype.getTotalGoals = function() {
  return (this.home_score || 0) + (this.away_score || 0);
};

// Métodos estáticos
Match.findLive = function() {
  return this.findAll({
    where: { status: ['live', 'halftime'] },
    order: [['match_date', 'ASC']]
  });
};

Match.findByDate = function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.findAll({
    where: {
      match_date: {
        [sequelize.Sequelize.Op.between]: [startOfDay, endOfDay]
      }
    },
    order: [['match_date', 'ASC']]
  });
};

Match.findByTeam = function(teamId) {
  return this.findAll({
    where: {
      [sequelize.Sequelize.Op.or]: [
        { home_team_id: teamId },
        { away_team_id: teamId }
      ]
    },
    order: [['match_date', 'DESC']]
  });
};

module.exports = Match;