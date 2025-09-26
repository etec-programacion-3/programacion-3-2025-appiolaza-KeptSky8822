const { Sequelize } = require("sequelize");

// Crea una base de datos SQLite en un archivo llamado database.sqlite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // Archivo donde se guardan los datos
  logging: false
})

module.exports = sequelize;
