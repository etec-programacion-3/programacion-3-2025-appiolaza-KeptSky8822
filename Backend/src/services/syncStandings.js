// backend/src/services/syncStandings.js
const apiClient = require('./apiFootballService');
const sequelize = require('../config/database');

async function syncStandings(competitionCode) {
  try {
    console.log(`🔄 Sincronizando posiciones de ${competitionCode}...`);

    // Determinar el competition_id basado en el código
    let competitionId;
    switch (competitionCode) {
      case 'CL': competitionId = 2001; break; // Champions League
      case 'PD': competitionId = 2014; break; // La Liga
      case 'PL': competitionId = 2021; break; // Premier League
      case 'BL1': competitionId = 2002; break; // Bundesliga
      case 'SA': competitionId = 2019; break; // Serie A
      case 'FL1': competitionId = 2015; break; // Ligue 1
      default: competitionId = 2001; // Valor por defecto
    }

    // Eliminar todos los registros existentes para esta competición antes de sincronizar
    await sequelize.query('DELETE FROM competition_standings WHERE competition_id = ?', {
      replacements: [competitionId]
    });
    console.log(`🗑️ Eliminados registros anteriores para competición ${competitionId}`);

    // Llamar a la API para obtener la tabla de posiciones
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

          // Insertar nueva posición
          await sequelize.query(`
            INSERT INTO competition_standings
            (competition_id, team_id, position, played_games, form, won, draw, lost, points,
             goals_for, goals_against, goal_difference, phase, group_name, last_updated, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))
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
              'REGULAR_SEASON',
              null // No hay grupo en ligas nacionales
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
