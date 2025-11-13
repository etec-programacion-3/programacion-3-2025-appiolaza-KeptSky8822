require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const axios = require('axios');
const sequelize = require('../config/database');

const apiClient = axios.create({
  baseURL: process.env.FOOTBALL_API_URL, // https://api.football-data.org/v4
  headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY }
});

// 🔁 Función auxiliar para esperar N milisegundos
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPlayersFromFootballData() {
  try {
    console.log('🔄 Cargando jugadores desde football-data.org con control de tasa...');

    const [teams] = await sequelize.query('SELECT id, external_id, name FROM teams WHERE is_active = 1');
    console.log(`📊 ${teams.length} equipos activos encontrados\n`);

    let totalInserted = 0;

    for (const team of teams) {
      console.log(`⚽ Procesando equipo: ${team.name}`);

      let response;
      try {
        response = await apiClient.get(`/teams/${team.external_id}`);
      } catch (error) {
        // Si nos rate-limitea, esperamos el tiempo sugerido
        if (error.response?.status === 429) {
          const waitText = error.response.data?.message || '';
          const match = waitText.match(/Wait (\d+) seconds/);
          const waitSeconds = match ? parseInt(match[1]) : 60;
          console.log(`⏳ Límite alcanzado, esperando ${waitSeconds} segundos...`);
          await delay(waitSeconds * 1000);
          response = await apiClient.get(`/teams/${team.external_id}`); // reintento
        } else {
          console.error(`❌ Error procesando equipo ${team.name}:`, error.response?.data || error.message);
          continue;
        }
      }

      const squad = response.data.squad || [];
      if (squad.length === 0) {
        console.log(`⚠️ No se encontraron jugadores en ${team.name}`);
        await delay(6000);
        continue;
      }

      for (const player of squad) {
        await sequelize.query(`
          INSERT OR IGNORE INTO players
          (first_name, last_name, display_name, date_of_birth, nationality, position, external_id, team_id, status, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
        `, {
          replacements: [
            player.name.split(' ')[0] || '',
            player.name.split(' ').slice(1).join(' ') || '',
            player.name,
            player.dateOfBirth || null,
            player.nationality || 'Unknown',
            player.position || 'Unknown',
            player.id.toString(),
            team.id
          ]
        });

        console.log(`✅ Insertado: ${player.name}`);
        totalInserted++;
      }

      // Espera entre equipos para evitar el límite
      console.log('⏱️ Esperando 6 segundos antes del próximo equipo...');
      await delay(6000);
    }

    console.log(`🎉 Carga completada. Total jugadores insertados: ${totalInserted}`);

  } catch (error) {
    console.error('❌ Error general:', error.response?.data || error.message);
  } finally {
    await sequelize.close();
  }
}

fetchPlayersFromFootballData();
