// backend/src/services/fetchLastCompetitionMatches.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const axios = require('axios');

const API_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.API_FOOTBALL_KEY; // tu key ya guardada en .env

async function fetchMatchById(matchId) {
  try {
    console.log(`🔍 Buscando información del partido con ID ${matchId}...`);

    const response = await axios.get(`${API_URL}/matches/${matchId}`, {
      headers: { 'X-Auth-Token': API_KEY },
    });

    const match = response.data.match;

    console.log('📊 Información del partido:');
    console.log(`🏆 Competición: ${match.competition.name} (${match.competition.code})`);
    console.log(`⚽ ${match.homeTeam.name} vs ${match.awayTeam.name}`);
    console.log(`📅 Fecha: ${match.utcDate}`);
    console.log(`⏱️ Estado: ${match.status}`);
    console.log(`🔢 Marcador final: ${match.score.fullTime.home} - ${match.score.fullTime.away}`);
    console.log(`🆔 ID: ${match.id}`);

  } catch (error) {
    if (error.response) {
      console.error('❌ Error en la API:', error.response.data);
    } else {
      console.error('❌ Error general:', error.message);
    }
  }
}

// 🧪 Ejecutar ejemplo con el ID que mencionaste
fetchMatchById(537891);
