const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING(200), // hash, no texto plano
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'moderator', 'user'),
    allowNull: false,
    defaultValue: 'user'
  },
  profile_picture: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['username'] },
    { fields: ['email'] }
  ]
});

// Métodos de instancia
User.prototype.isAdmin = function() {
  return this.role === 'admin';
};

User.prototype.isModerator = function() {
  return this.role === 'moderator';
};
User.associate = (models) => {
  User.belongsToMany(models.Team, {
    through: models.FavoriteTeamUser,
    foreignKey: 'user_id',
    as: 'favoriteTeams'
  });
};

User.associate = (models) => {
  User.belongsToMany(models.Player, {
    through: models.FavoritePlayer,
    foreignKey: 'userId',
    otherKey: 'playerId',
    as: 'favoritePlayers'
  });
  User.hasMany(models.FavoritePlayer, { foreignKey: 'userId' });
};

module.exports = User;
