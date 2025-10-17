// src/seeders/seedStandings.js
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Importamos los modelos
const Competition = require('../models/competicion');
const Team = require('../models/equipo');
const CompetitionStanding = require('../models/CompetitionStanding')(sequelize, DataTypes);

async function seedStandings() {
  try {
    console.log('🔄 Iniciando seed de CompetitionStandings...');

    // Conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión establecida con SQLite.');

    // Sincronizamos el modelo (crea la tabla si no existe)
    await sequelize.sync();
    console.log('🧩 Tablas sincronizadas.');

    // Limpiamos los datos anteriores
    await CompetitionStanding.destroy({ where: {} });
    console.log('🗑️ Tabla CompetitionStanding vaciada.');

    // Obtenemos las competiciones y equipos existentes
    const competitions = await Competition.findAll();
    const teams = await Team.findAll();

    if (competitions.length === 0 || teams.length === 0) {
      console.log('⚠️ No hay competiciones o equipos cargados. Primero ejecuta los seeds de competitions y teams.');
      return;
    }

    // Creamos standings de ejemplo (cada equipo en cada competición)
    const standings = [];

    competitions.forEach((competition) => {
      teams.forEach((team, i) => {
        standings.push({
          competition_id: competition.id,
          team_id: team.id,
          phase: 'GROUP_STAGE',
          group_name: `Group ${String.fromCharCode(65 + (i % 4))}`, // A, B, C, D
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goals_for: 0,
          goals_against: 0,
          goal_difference: 0,
          points: 0,
        });
      });
    });

    await CompetitionStanding.bulkCreate(standings);
    console.log(`🎉 ${standings.length} registros de standings creados correctamente.`);

  } catch (error) {
    console.error('❌ Error al ejecutar seedStandings:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Conexión cerrada.');
  }
}

// Ejecutamos la función
seedStandings();
