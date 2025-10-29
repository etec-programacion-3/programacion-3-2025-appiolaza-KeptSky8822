const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompetitionStanding = sequelize.define('CompetitionStanding', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  competition_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'competitions', key: 'id' },
    onDelete: 'CASCADE'
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
    onDelete: 'CASCADE'
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Posición en la tabla de posiciones'
  },
  phase: {
    type: DataTypes.ENUM('GROUP_STAGE', 'ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL'),
    allowNull: false,
    defaultValue: 'GROUP_STAGE'
  },
  group_name: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  played_games: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  form: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'Últimos resultados (ej: WWDL)'
  },
  won: { type: DataTypes.INTEGER, defaultValue: 0 },
  draw: { type: DataTypes.INTEGER, defaultValue: 0 },
  lost: { type: DataTypes.INTEGER, defaultValue: 0 },
  points: { type: DataTypes.INTEGER, defaultValue: 0 },
  goals_for: { type: DataTypes.INTEGER, defaultValue: 0 },
  goals_against: { type: DataTypes.INTEGER, defaultValue: 0 },
  goal_difference: { type: DataTypes.INTEGER, defaultValue: 0 },
  last_updated: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Última actualización desde API externa'
  }
}, {
  tableName: 'competition_standings',
  indexes: [
    { fields: ['competition_id'] },
    { fields: ['team_id'] },
    { fields: ['competition_id', 'phase'] },
    { fields: ['competition_id', 'group_name'] }
  ]
});


// =============================
// 🔗 Asociaciones
// =============================
CompetitionStanding.associate = (models) => {
  CompetitionStanding.belongsTo(models.Competition, {
    foreignKey: 'competition_id',
    onDelete: 'CASCADE'
  });

  CompetitionStanding.belongsTo(models.Team, {
    foreignKey: 'team_id',
    onDelete: 'CASCADE'
  });
};

// =============================
// ⚙️ Métodos útiles
// =============================

// Buscar por competencia y grupo
CompetitionStanding.findByCompetition = function (competitionId) {
  return this.findAll({
    where: { competition_id: competitionId },
    order: [['position', 'ASC']]
  });
};

// Actualizar estadísticas
CompetitionStanding.prototype.updateStats = function (matchResult) {
  this.played_games += 1;
  this.goals_for += matchResult.goals_for;
  this.goals_against += matchResult.goals_against;
  this.goal_difference = this.goals_for - this.goals_against;
  this.points += matchResult.points;
  return this.save();
};

module.exports = CompetitionStanding;
