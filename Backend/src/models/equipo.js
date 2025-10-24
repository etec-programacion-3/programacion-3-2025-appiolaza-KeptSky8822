const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  short_name: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'Código de 3 letras del equipo (ej: FCB, RMA)'
  },
  founded: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1800,
      max: new Date().getFullYear()
    }
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  stadium: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  stadium_capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  website: {
    type: DataTypes.STRING(200),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  colors: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '{"primary": "#FF0000", "secondary": "#FFFFFF"}'
  },
  market_value: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Valor de mercado del equipo en euros'
  },
  external_id: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  is_national_team: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'teams',
  indexes: [
    { fields: ['name'] },
    { fields: ['country'] },
    { fields: ['code'] },
    { fields: ['external_id'] },
    { fields: ['is_active'] }
  ]
});

// Métodos de instancia
Team.prototype.getFullName = function() {
  return this.city ? `${this.name} (${this.city})` : this.name;
};

// Métodos estáticos
Team.findByCountry = function(country) {
  return this.findAll({
    where: { country, is_active: true },
    order: [['name', 'ASC']]
  });
};

Team.associate = (models) => {
  Team.belongsToMany(models.Competition, {
    through: 'CompetitionStanding',
    foreignKey: 'team_id',
    otherKey: 'competition_id'
  });
  Team.belongsToMany(models.User, {
    through: models.FavoriteTeamUser,
    foreignKey: 'team_id',
    as: 'fans'
  });
};

module.exports = Team;