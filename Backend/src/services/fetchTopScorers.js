// src/services/fetchTopScorers.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const axios = require('axios');
const sequelize = require('../config/database');
const Competition = require('../models/competicion');
const Player = require('../models/jugador');
const PlayerStatistics = require('../models/jugadores_estadistica');

const API_BASE_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_API_KEY || 'ab8832c40fbc4852bf2ababb3a679b12';

// Lista de competiciones a sincronizar
const COMPETITIONS = [
  { code: 'CL', name: 'UEFA Champions League' },
  { code: 'PL', name: 'Premier League' },
  { code: 'BL1', name: 'Bundesliga' },
  { code: 'PD', name: 'La Liga' },
  { code: 'SA', name: 'Serie A' },
  { code: 'FL1', name: 'Ligue 1' }
];

async function fetchTopScorers(competitionCode) {
  try {
    console.log(`\n🔄 Buscando máximos goleadores de ${competitionCode}...`);
    const response = await axios.get(`${API_BASE_URL}/competitions/${competitionCode}/scorers`, {
      headers: { 'X-Auth-Token': API_KEY }
    });

    const scorers = response.data.scorers || [];
    const competitionData = response.data.competition || {};
    const season = response.data.season?.startDate?.split('-')[0] || '2024';

    // Buscar o crear competencia usando el ID de la API como ID interno
    const [competition] = await Competition.findOrCreate({
      where: { id: competitionData.id }, // usamos directamente el ID de la competencia
      defaults: {
        name: competitionData.name,
        short_name: competitionCode,
        country: competitionData.area?.name || null,
        season: season,
        type: competitionData.type || 'LEAGUE',
        logo_url: competitionData.emblem || null,
        start_date: response.data.season?.startDate,
        end_date: response.data.season?.endDate,
        status: 'active',
        is_active: true,
        last_updated: new Date()
      }
    });

    console.log(`✅ ${competition.name}: ${scorers.length} goleadores encontrados.`);

    for (const item of scorers) {
      const playerData = item.player;
      const stats = item || {};

      // Buscar jugador en DB
      const player = await Player.findOne({
        where: { external_id: playerData.id }
      });

      if (!player) {
        console.warn(`⚠️ Jugador no encontrado: ${playerData.name}`);
        continue;
      }

      // Insertar o actualizar estadísticas del jugador
      await PlayerStatistics.upsert({
        player_id: player.id,
        id_competition: competition.id, // ID interno que es igual al de la API
        season: season,
        games_played: stats.playedMatches || 0,
        goals: stats.goals || 0,
        assists: stats.assists || 0,
        minutes_played: stats.minutes || 0,
        yellow_cards: stats.yellowCards || 0,
        red_cards: stats.redCards || 0,
        last_updated: new Date()
      });
    }

    console.log(`✅ Estadísticas de ${competition.name} guardadas correctamente.`);
  } catch (error) {
    console.error(`❌ Error en ${competitionCode}:`, error.response?.data || error.message);
  }
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión con la base de datos establecida.');
    for (const comp of COMPETITIONS) {
      await fetchTopScorers(comp.code);
    }
    console.log('\n🏁 Sincronización finalizada.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error general:', err);
    process.exit(1);
  }
})();
