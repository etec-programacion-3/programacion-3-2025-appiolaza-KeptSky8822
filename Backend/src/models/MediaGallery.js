const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Article = require('./Articulo'); // asegurate que este nombre coincida con tu archivo real

const MediaGallery = sequelize.define('MediaGallery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'articles',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  type: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'media_gallery',
  timestamps: true,
});

// 👇 Relación correcta
Article.hasMany(MediaGallery, { foreignKey: 'article_id', as: 'media' });
MediaGallery.belongsTo(Article, { foreignKey: 'article_id', as: 'article' });

module.exports = MediaGallery;
