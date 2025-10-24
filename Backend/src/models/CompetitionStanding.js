module.exports = (sequelize, DataTypes) => {
  const CompetitionStanding = sequelize.define('CompetitionStanding', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    competition_id : {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'competitions' , key: 'id' },
      onDelete: 'CASCADE'
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'teams', key: 'id' },
      onDelete: 'CASCADE'
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
    played: { type: DataTypes.INTEGER, defaultValue: 0 },
    wins: { type: DataTypes.INTEGER, defaultValue: 0 },
    draws: { type: DataTypes.INTEGER, defaultValue: 0 },
    losses: { type: DataTypes.INTEGER, defaultValue: 0 },
    goals_for: { type: DataTypes.INTEGER, defaultValue: 0 },
    goals_against: { type: DataTypes.INTEGER, defaultValue: 0 },
    goal_difference: { type: DataTypes.INTEGER, defaultValue: 0 },
    points: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'competition_standings',
    indexes: [
      { fields: ['competition_id'] },
      { fields: ['team_id'] },
      { fields: ['competition_id', 'phase'] },
      { fields: ['competition_id', 'group_name'] }
    ]
  });

  return CompetitionStanding;
};
         