const { Sequelize,DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // acá está tu configuración



// Crear instancia de Sequelize

// Importar modelos pasando sequelize y DataTypes
const Competition = require('./competicion');
const CompetitionStanding = require('./CompetitionStanding');
const Team = require('./equipo');
const Player = require('./jugador');
const PlayerStatistics = require('./jugadores_estadistica');
const Match = require('./partido');
const MatchEvent = require('./partidoevent');
const User = require('./usuario');
const FavoriteTeamUser = require('./equipos_favoritos_usuarios');

// =============================
// Definición de Relaciones
// =============================

// Competition -> Teams
Competition.hasMany(Team, { foreignKey: 'competition_id' });
Team.belongsTo(Competition, { foreignKey: 'competition_id' });

// Team -> Players
Team.hasMany(Player, { foreignKey: 'team_id' });
Player.belongsTo(Team, { foreignKey: 'team_id' });

// Match -> Competition
Competition.hasMany(Match, { foreignKey: 'competition_id' });
Match.belongsTo(Competition, { foreignKey: 'competition_id' });

// Match -> Teams (local y visitante)
Team.hasMany(Match, { foreignKey: 'home_team_id', as: 'homeMatches' });
Team.hasMany(Match, { foreignKey: 'away_team_id', as: 'awayMatches' });
Match.belongsTo(Team, { foreignKey: 'home_team_id', as: 'homeTeam' });
Match.belongsTo(Team, { foreignKey: 'away_team_id', as: 'awayTeam' });

// MatchEvent -> Match
Match.hasMany(MatchEvent, { foreignKey: 'match_id' });
MatchEvent.belongsTo(Match, { foreignKey: 'match_id' });

// MatchEvent -> Player
Player.hasMany(MatchEvent, { foreignKey: 'player_id' });
MatchEvent.belongsTo(Player, { foreignKey: 'player_id' });

// Player -> PlayerStatistics
Player.hasOne(PlayerStatistics, { foreignKey: 'player_id' });
PlayerStatistics.belongsTo(Player, { foreignKey: 'player_id' });

// Usuario -> Favoritos (relación muchos a muchos con equipos)
User.belongsToMany(Team, { through: FavoriteTeamUser, foreignKey: 'user_id' });
Team.belongsToMany(User, { through: FavoriteTeamUser, foreignKey: 'team_id' });

// Exportar
module.exports = {
  sequelize,
  Sequelize,
  Competition,
  CompetitionStanding,
  Team,
  Player,
  PlayerStatistics,
  Match,
  MatchEvent,
  User,
  FavoriteTeamUser,
};
