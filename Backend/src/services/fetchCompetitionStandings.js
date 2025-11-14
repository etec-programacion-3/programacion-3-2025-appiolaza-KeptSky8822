require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const axios = require('axios');
const { CompetitionStanding, Competition, Team } = require('../models'); // Ajustá si tus modelos están en otra carpeta
const sequelize = require('../config/database');

const API_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_API_KEY;

/**
 * 🔄 Sincroniza la tabla de posiciones de una competición
 * @param {string} competitionCode Código corto (ej: 'PL', 'PD', 'SA', 'BL1', 'FL1')
 */
async function fetchCompetitionStandings(competitionCode) {
  try {
    console.log(`📊 Obteniendo tabla de posiciones de ${competitionCode}...`);

    const response = await axios.get(`${API_URL}/competitions/${competitionCode}/standings`, {
      headers: { 'X-Auth-Token': API_KEY },
    });

    const { competition, standings } = response.data;

    if (!standings || standings.length === 0) {
      console.log(`⚠️ No se encontraron standings para ${competitionCode}.`);
      return;
    }

    const table = standings[0].table;

    // Inicia una transacción para mantener coherencia
    await sequelize.transaction(async (t) => {
      for (const teamData of table) {
        // Buscar o crear el equipo
        const [team] = await Team.findOrCreate({
          where: { name: teamData.team.name },
          defaults: { external_id: teamData.team.id },
          transaction: t,
        });

        // Buscar o crear el registro de standings
        await CompetitionStanding.upsert(
          {
            competition_id: competition.id,
            team_id: team.id,
            position: teamData.position,
            phase: 'GROUP_STAGE',
            group_name: standings[0].group || null,
            played_games: teamData.playedGames,
            form: teamData.form,
            won: teamData.won,
            draw: teamData.draw,
            lost: teamData.lost,
            points: teamData.points,
            goals_for: teamData.goalsFor,
            goals_against: teamData.goalsAgainst,
            goal_difference: teamData.goalDifference,
            last_updated: new Date(),
          },
          { transaction: t }
        );
      }
    });

    console.log(`✅ Tabla de posiciones de ${competition.name} sincronizada correctamente.`);
  } catch (error) {
    if (error.response) {
      console.error(`❌ Error en la API (${competitionCode}):`, error.response.data);
    } else {
      console.error(`❌ Error general (${competitionCode}):`, error.message);
    }
  }
}

/**
 * Ejecuta la sincronización para múltiples competiciones
 */
async function fetchAllStandings() {
  const competitions = ['PL', 'PD', 'SA', 'BL1', 'FL1', 'CL']; // Premier, La Liga, Serie A, Bundesliga, Ligue 1
  for (const code of competitions) {
    await fetchCompetitionStandings(code);
  }
  console.log('🏁 Sincronización de tablas completada.');
}

// Ejecutar directamente si se llama por CLI
if (require.main === module) {
  fetchAllStandings();
}

module.exports = { fetchCompetitionStandings, fetchAllStandings };
