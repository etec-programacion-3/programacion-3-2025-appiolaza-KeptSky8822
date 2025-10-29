// backend/src/services/syncStandings.js
const apiClient = require('./apiFootballService');
const sequelize = require('../config/database');

async function syncStandings(competitionCode) {
  try {
    console.log(`🔄 Sincronizando posiciones de ${competitionCode}...`);

    const response = await apiClient.get(`/competitions/${competitionCode}/standings`);
    const standings = response.data.standings[0].table;

    console.log(`📊 Encontradas ${standings.length} posiciones`);

    let updated = 0;
    for (const standing of standings) {
      try {
        const teamId = standing.team.id;

        // Buscar el equipo en la base de datos
        const [teams] = await sequelize.query(
          'SELECT id FROM teams WHERE external_id = ?',
          { replacements: [teamId] }
        );

        if (teams.length > 0) {
          const dbTeamId = teams[0].id;

          // Determinar el competition_id basado en el código
          let competitionId;
          switch (competitionCode) {
            case 'CL': competitionId = 2001; break; // Champions League
            case 'PD': competitionId = 2014; break; // La Liga
            case 'CLI': competitionId = 2013; break; // Libertadores
            case 'PL': competitionId = 2021; break; // Premier League
            default: competitionId = 2001;
          }

          // Insertar o actualizar posición
          await sequelize.query(`
            INSERT OR REPLACE INTO competition_standings
            (competition_id, team_id, position, played_games, form, won, draw, lost, points,
             goals_for, goals_against, goal_difference, phase, group_name, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
          `, {
            replacements: [
              competitionId,
              dbTeamId,
              standing.position,
              standing.playedGames,
              standing.form || null,
              standing.won,
              standing.draw,
              standing.lost,
              standing.points,
              standing.goalsFor,
              standing.goalsAgainst,
              standing.goalDifference,
              'GROUP_STAGE',
              'A', // Default group
            ]
          });

          updated++;
        } else {
          console.log(`⚠️ Equipo ${standing.team.name} no encontrado en BD`);
        }
      } catch (error) {
        console.log(`❌ Error actualizando ${standing.team.name}: ${error.message}`);
      }
    }

    console.log(`✅ Actualizadas ${updated} posiciones de ${competitionCode}!`);
    return updated;
  } catch (error) {
    console.error(`❌ Error sincronizando posiciones de ${competitionCode}:`, error.response?.data || error.message);
    throw error;
  }
}

module.exports = { syncStandings };