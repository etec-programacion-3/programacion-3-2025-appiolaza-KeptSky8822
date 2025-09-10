const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Competition = sequelize.define('Competition', {
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
  country: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  season: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM,
    values: ['league', 'cup', 'tournament'],
    allowNull: false,
    defaultValue: 'league'
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM,
    values: ['upcoming', 'ongoing', 'finished'],
    allowNull: false,
    defaultValue: 'upcoming'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'competitions',
  indexes: [
    {
      fields: ['country']
    },
    {
      fields: ['season']
    },
    {
      fields: ['type']
    },
    {
      fields: ['status']
    }
  ],
  hooks: {
    beforeSave: (competition) => {
      // Validar fechas si ambas están presentes
      if (competition.start_date && competition.end_date) {
        if (new Date(competition.start_date) >= new Date(competition.end_date)) {
          throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
        }
      }
    }
  }
});

// Métodos de instancia
Competition.prototype.isActive = function() {
  return this.is_active && this.status !== 'finished';
};

// Métodos estáticos para consultas comunes
Competition.findActive = function() {
  return this.findAll({
    where: { 
      is_active: true,
      status: ['upcoming', 'ongoing']
    },
    order: [['created_at', 'DESC']]
  });
};

Competition.findByCountry = function(country) {
  return this.findAll({
    where: { 
      country: country,
      is_active: true 
    },
    order: [['name', 'ASC']]
  });
};

Competition.findByType = function(type) {
  return this.findAll({
    where: { 
      type: type,
      is_active: true 
    },
    order: [['name', 'ASC']]
  });
};

module.exports = Competition;