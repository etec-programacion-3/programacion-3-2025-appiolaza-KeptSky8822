// backend/src/services/fetchPlayers.js
const apiClient = require('./apiFootballService');
const sequelize = require('../config/database');

async function fetchPlayers(competitionCode, season) {
  try {
    console.log(`🔄 Sincronizando jugadores de ${competitionCode} temporada ${season}...`);

    // Obtener equipos de la competición desde la tabla de posiciones
    const [teams] = await sequelize.query(
      'SELECT t.id, t.external_id, t.name FROM teams t INNER JOIN competition_standings cs ON t.external_id = cs.team_id WHERE cs.competition_id = (SELECT id FROM competitions WHERE name LIKE ? LIMIT 1)',
      { replacements: [`%${competitionCode === 'CL' ? 'Champions League' : competitionCode}%`] }
    );

    console.log(`📊 Encontrados ${teams.length} equipos en ${competitionCode}`);

    let totalPlayers = 0;

    for (const team of teams) {
      try {
        console.log(`👤 Sincronizando jugadores de ${team.name}...`);

        // Usar endpoint /players/squads para obtener la plantilla completa del equipo
        try {
          const response = await apiClient.get('/players/squads', {
            params: {
              team: team.external_id
            }
          });

          if (response.data.response && response.data.response.length > 0) {
            players = response.data.response[0].players;
            console.log(`✅ Encontrados ${players.length} jugadores en temporada actual`);
          } else {
            players = [];
            console.log(`⚠️ No se encontraron jugadores para ${team.name}`);
          }
        } catch (seasonError) {
          console.log(`⚠️ Temporada no disponible para ${team.name}`);
          players = [];
        }

        if (players.length === 0) {
          console.log(`⚠️ No se encontraron jugadores para ${team.name} en ninguna temporada`);
          continue;
        }

        for (const player of players) {
          try {
            // Extraer nombre y apellido del campo 'name'
            const nameParts = player.name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            await sequelize.query(`
              INSERT OR REPLACE INTO players
              (first_name, last_name, display_name, date_of_birth, nationality, position, detailed_position,
               jersey_number, height, weight, preferred_foot, photo_url, status, external_id, team_id,
               last_updated, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))
            `, {
              replacements: [
                firstName,
                lastName,
                player.name,
                null, // No tenemos fecha de nacimiento en este endpoint
                'Unknown', // No tenemos nacionalidad en este endpoint
                player.position || 'Unknown',
                player.position || null,
                player.number || null,
                null, // No tenemos altura en este endpoint
                null, // No tenemos peso en este endpoint
                null, // No tenemos pie preferido en este endpoint
                player.photo || null,
                'active',
                player.id,
                team.id
              ]
            });

            totalPlayers++;
          } catch (playerError) {
            console.log(`❌ Error guardando jugador ${player.name}: ${playerError.message}`);
          }
        }

        // Pequeña pausa para no sobrecargar la API
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (teamError) {
        console.log(`❌ Error obteniendo jugadores de ${team.name}: ${teamError.message}`);
      }
    }

    console.log(`✅ Sincronizados ${totalPlayers} jugadores de ${competitionCode}!`);
    return totalPlayers;
  } catch (error) {
    console.error(`❌ Error sincronizando jugadores de ${competitionCode}:`, error.response?.data || error.message);
    throw error;
  }
}

module.exports = { fetchPlayers };
