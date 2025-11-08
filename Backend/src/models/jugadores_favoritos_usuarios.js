// src/models/jugadores_favoritos_usuarios.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FavoritePlayer = sequelize.define('FavoritePlayer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
  playerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Players', key: 'id' } }
}, {
  tableName: 'favorite_players'
});

FavoritePlayer.associate = (models) => {
  FavoritePlayer.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  FavoritePlayer.belongsTo(models.Player, { foreignKey: 'playerId', as: 'player' });
};



module.exports = FavoritePlayer;
