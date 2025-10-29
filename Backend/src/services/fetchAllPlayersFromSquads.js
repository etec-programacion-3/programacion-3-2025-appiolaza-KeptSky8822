// backend/fetchAllPlayersFromSquads.js
require('dotenv').config();
const axios = require('axios');
const sequelize = require('./src/config/database');

const apiClient = axios.create({
  baseURL: process.env.FOOTBALL_API_URL,
  headers: {
    'Authorization': process.env.FOOTBALL_API_KEY
  }
});

// Mapear position_id de la API a las posiciones de la base de datos
const positionMapping = {
  24: 'goalkeeper',    // Goalkeeper
  25: 'defender',      // Defender
  26: 'midfielder',    // Midfielder
  27: 'forward'        // Forward
};

// Mapear detailed_position_id a posiciones detalladas
const detailedPositionMapping = {
  24: 'GK',   // Goalkeeper
  148: 'CB',  // Centre Back
  149: 'LB',  // Left Back
  150: 'RB',  // Right Back
  151: 'LW',  // Left Wing
  152: 'RW',  // Right Wing
  153: 'CM',  // Central Midfielder
  154: 'CDM', // Defensive Midfielder
  155: 'CAM', // Attacking Midfielder
  156: 'ST'   // Striker
};

async function fetchAllPlayersFromSquads() {
  try {
    console.log('🔄 Iniciando fetch de todos los jugadores desde squads...');

    // Obtener todos los equipos de la base de datos
    const [teams] = await sequelize.query('SELECT id, external_id, name FROM teams WHERE is_active = 1');
    console.log(`📊 Encontrados ${teams.length} equipos activos en la base de datos`);

    let totalPlayersProcessed = 0;
    let totalPlayersInserted = 0;
    let totalPlayersUpdated = 0;

    for (const team of teams) {
      try {
        console.log(`👥 Procesando equipo: ${team.name} (ID: ${team.external_id})`);

        // Obtener la plantilla del equipo desde la API
        const squadsResponse = await apiClient.get(`/squads/teams/${team.external_id}`);

        if (!squadsResponse.data || !squadsResponse.data.data || squadsResponse.data.data.length === 0) {
          console.log(`⚠️ No se encontraron squads para ${team.name}`);
          continue;
        }

        const squadPlayers = squadsResponse.data.data;
        console.log(`📋 ${squadPlayers.length} jugadores en la plantilla de ${team.name}`);

        for (const squadPlayer of squadPlayers) {
          try {
            // Obtener información detallada del jugador desde /players
            const playerResponse = await apiClient.get(`/players/${squadPlayer.player_id}`);

            if (!playerResponse.data || !playerResponse.data.data) {
              console.log(`⚠️ No se encontró información para el jugador ID ${squadPlayer.player_id}`);
              continue;
            }

            const playerData = playerResponse.data.data;
            console.log(`🔍 Procesando jugador: ${playerData.display_name || playerData.name} (ID: ${playerData.id})`);

            // Mapear campos de la API a la base de datos
            const playerRecord = {
              first_name: playerData.firstname || '',
              last_name: playerData.lastname || '',
              display_name: playerData.display_name || playerData.name || '',
              date_of_birth: playerData.date_of_birth || null,
              nationality: playerData.nationality || 'Unknown',
              position: positionMapping[squadPlayer.position_id] || 'Unknown',
              detailed_position: detailedPositionMapping[squadPlayer.detailed_position_id] || null,
              jersey_number: squadPlayer.jersey_number || null,
              height: playerData.height ? parseInt(playerData.height) : null,
              weight: playerData.weight ? parseInt(playerData.weight) : null,
              preferred_foot: null, // No disponible en este endpoint
              photo_url: playerData.image_path || null,
              status: 'active',
              external_id: playerData.id.toString(),
              team_id: team.id,
              last_updated: new Date()
            };

            // Verificar si el jugador ya existe
            const [existingPlayer] = await sequelize.query(
              'SELECT id FROM players WHERE external_id = ?',
              { replacements: [playerRecord.external_id] }
            );

            if (existingPlayer.length > 0) {
              // Actualizar jugador existente
              await sequelize.query(`
                UPDATE players SET
                  first_name = ?,
                  last_name = ?,
                  display_name = ?,
                  date_of_birth = ?,
                  nationality = ?,
                  position = ?,
                  detailed_position = ?,
                  jersey_number = ?,
                  height = ?,
                  weight = ?,
                  photo_url = ?,
                  team_id = ?,
                  last_updated = ?,
                  updatedAt = datetime('now')
                WHERE external_id = ?
              `, {
                replacements: [
                  playerRecord.first_name,
                  playerRecord.last_name,
                  playerRecord.display_name,
                  playerRecord.date_of_birth,
                  playerRecord.nationality,
                  playerRecord.position,
                  playerRecord.detailed_position,
                  playerRecord.jersey_number,
                  playerRecord.height,
                  playerRecord.weight,
                  playerRecord.photo_url,
                  playerRecord.team_id,
                  playerRecord.last_updated,
                  playerRecord.external_id
                ]
              });
              totalPlayersUpdated++;
              console.log(`✅ Actualizado: ${playerRecord.display_name}`);
            } else {
              // Insertar nuevo jugador
              await sequelize.query(`
                INSERT INTO players
                (first_name, last_name, display_name, date_of_birth, nationality, position, detailed_position,
                 jersey_number, height, weight, preferred_foot, photo_url, status, external_id, team_id,
                 last_updated, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
              `, {
                replacements: [
                  playerRecord.first_name,
                  playerRecord.last_name,
                  playerRecord.display_name,
                  playerRecord.date_of_birth,
                  playerRecord.nationality,
                  playerRecord.position,
                  playerRecord.detailed_position,
                  playerRecord.jersey_number,
                  playerRecord.height,
                  playerRecord.weight,
                  playerRecord.preferred_foot,
                  playerRecord.photo_url,
                  playerRecord.status,
                  playerRecord.external_id,
                  playerRecord.team_id,
                  playerRecord.last_updated
                ]
              });
              totalPlayersInserted++;
              console.log(`✅ Insertado: ${playerRecord.display_name}`);
            }

            totalPlayersProcessed++;

            // Pausa para no sobrecargar la API (2 segundos entre requests)
            await new Promise(resolve => setTimeout(resolve, 2000));

          } catch (playerError) {
            console.error(`❌ Error procesando jugador ${squadPlayer.player_id}:`, playerError.response?.data?.message || playerError.message);
          }
        }

        // Pausa adicional entre equipos
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (teamError) {
        console.error(`❌ Error procesando equipo ${team.name}:`, teamError.response?.data?.message || teamError.message);
      }
    }

    console.log(`\n🎉 Fetch completado!`);
    console.log(`📊 Total de jugadores procesados: ${totalPlayersProcessed}`);
    console.log(`✅ Jugadores insertados: ${totalPlayersInserted}`);
    console.log(`🔄 Jugadores actualizados: ${totalPlayersUpdated}`);

  } catch (error) {
    console.error('❌ Error general:', error.response?.status, error.response?.data?.message || error.message);
  } finally {
    await sequelize.close();
  }
}

fetchAllPlayersFromSquads();