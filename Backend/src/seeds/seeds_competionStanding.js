const sequelize = require('../config/database');
const Competition = require('../models/competicion'); // Ajusta según tu proyecto
const Team = require('../models/equipo');
const CompetitionStanding = require('../models/CompetitionStanding')(sequelize, require('sequelize').DataTypes);

async function seedStandings() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');

    await sequelize.sync();
    console.log('📦 Modelos sincronizados.');

    // Limpiar datos existentes
    await CompetitionStanding.destroy({ where: {} });
    console.log('🗑️ Datos anteriores eliminados.');

    // Tomamos todas las competiciones y equipos existentes
    const competitions = await Competition.findAll();
    const teams = await Team.findAll();

    if (competitions.length === 0 || teams.length === 0) {
      console.log('⚠️ No hay competiciones o equipos cargados para repoblar standings.');
      return;
    }

    const standings = [];

    // Crear standings de ejemplo: cada equipo en cada competición
    competitions.forEach((competition, index) => {
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
          points: 0
        });
      });
    });

    await CompetitionStanding.bulkCreate(standings);
    console.log(`🎉 ${standings.length} registros de standings creados exitosamente.`);

  } catch (error) {
    console.error('❌ Error al repoblar standings:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Conexión cerrada.');
  }
}

seedStandings();
