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
const FavoriteTeam = require('./equipos_favoritos_usuarios');
const FavoritePlayer = require('./jugadores_favoritos_usuarios');
const Article = require('./Articulo');
const MediaGallery = require('./MediaGallery');

// =============================
// Definición de Relaciones
// =============================

// Team <-> Competition a través de CompetitionStanding
Team.belongsToMany(Competition, {
  through: CompetitionStanding,
  foreignKey: 'team_id',
  otherKey: 'competition_id'
});

Competition.belongsToMany(Team, {
  through: CompetitionStanding,
  foreignKey: 'competition_id',
  otherKey: 'team_id'
});

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

// Competition -> PlayerStatistics
Competition.hasMany(PlayerStatistics, { foreignKey: 'id_competition' });
PlayerStatistics.belongsTo(Competition, { foreignKey: 'id_competition' });

// Usuario -> Favoritos (relación muchos a muchos con equipos)
User.belongsToMany(Team, { through: FavoriteTeam, foreignKey: 'user_id' , as: 'favoriteTeams'});
Team.belongsToMany(User, { through: FavoriteTeam, foreignKey: 'team_id' ,as: 'teamfans'});

// Usuarios -> Jugadores favoritos
User.belongsToMany(Player, { through: FavoritePlayer, foreignKey: 'userId', as: 'favoritePlayers' });
Player.belongsToMany(User, { through: FavoritePlayer, foreignKey: 'playerId', as: 'playerfans' });

// Article -> MediaGallery
Article.hasMany(MediaGallery, { as: 'mediaItems', foreignKey: 'articleId', onDelete: 'CASCADE' });
MediaGallery.belongsTo(Article, { foreignKey: 'articleId', as: 'parentArticle' });

// Exportar
module.exports = {
  sequelize,
  Sequelize,
  Competition,
  Team,
  CompetitionStanding,
  Player,
  PlayerStatistics,
  Match,
  MatchEvent,
  User,
  FavoriteTeam,
  FavoritePlayer,
  Article,
  MediaGallery,
};
