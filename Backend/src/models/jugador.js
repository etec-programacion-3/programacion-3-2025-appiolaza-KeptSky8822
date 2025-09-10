const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  full_name: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.first_name} ${this.last_name}`;
    }
  },
  display_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Nombre que se muestra en la camiseta'
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  age: {
    type: DataTypes.VIRTUAL,
    get() {
      if (!this.date_of_birth) return null;
      const today = new Date();
      const birthDate = new Date(this.date_of_birth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
  },
  nationality: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  second_nationality: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  position: {
    type: DataTypes.ENUM,
    values: ['goalkeeper', 'defender', 'midfielder', 'forward'],
    allowNull: false
  },
  detailed_position: {
    type: DataTypes.STRING(30),
    allowNull: true,
    comment: 'CB, LB, CDM, CAM, LW, ST, etc.'
  },
  jersey_number: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 99
    }
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Altura en centímetros'
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Peso en kilogramos'
  },
  foot: {
    type: DataTypes.ENUM,
    values: ['left', 'right', 'both'],
    allowNull: true
  },
  market_value: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Valor de mercado en euros'
  },
  contract_until: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  photo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['active', 'injured', 'suspended', 'on_loan', 'retired'],
    allowNull: false,
    defaultValue: 'active'
  },
  injury_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  injury_until: {
    type: DataTypes.DATEONLY,
    allowNull: true
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
  // Referencias foráneas
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'teams',
      key: 'id'
    }
  }
}, {
  tableName: 'players',
  indexes: [
    { fields: ['first_name', 'last_name'] },
    { fields: ['nationality'] },
    { fields: ['position'] },
    { fields: ['team_id'] },
    { fields: ['external_id'] },
    { fields: ['status'] }
  ]
});

// Métodos de instancia
Player.prototype.isInjured = function() {
  return this.status === 'injured' && 
         (!this.injury_until || new Date(this.injury_until) > new Date());
};

Player.prototype.isContractExpiring = function() {
  if (!this.contract_until) return false;
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  return new Date(this.contract_until) <= sixMonthsFromNow;
};

// Métodos estáticos
Player.findByPosition = function(position) {
  return this.findAll({
    where: { position, is_active: true },
    order: [['last_name', 'ASC']]
  });
};

Player.findByNationality = function(nationality) {
  return this.findAll({
    where: { nationality, is_active: true },
    order: [['last_name', 'ASC']]
  });
};

module.exports = Player;