// src/services/fetchPastMatches.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const axios = require('axios');
const sequelize = require('../config/database');
const Match = require('../models/partido');
const { Competition, Team } = require('../models'); // Asegúrate de tener estos modelos exportados

const BASE_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_API_KEY;

// Solo ligas nacionales
const COMPETITIONS = [
  { name: 'Premier League', code: 'PL' },
  { name: 'La Liga', code: 'PD' },
  { name: 'Serie A', code: 'SA' },
  { name: 'Bundesliga', code: 'BL1' },
  { name: 'Ligue 1', code: 'FL1' },
];

const SEASON = 2025;

async function fetchPastMatches(competitionCode, competitionName) {
  try {
    console.log(`🔄 Obteniendo partidos finalizados de ${competitionName} (${competitionCode})...`);

    const response = await axios.get(`${BASE_URL}/competitions/${competitionCode}/matches`, {
      headers: { 'X-Auth-Token': API_KEY },
      params: {
        status: 'FINISHED',
        season: SEASON,
      },
    });

    const matches = response.data.matches || [];
    console.log(`✅ ${competitionName}: ${matches.length} partidos finalizados encontrados.`);

    // Buscar la competencia en la base (por nombre o código)
    const competition = await Competition.findOne({
      where: { name: competitionName },
    });

    if (!competition) {
      console.warn(`⚠️ Competición ${competitionName} no encontrada en la BD. Saltando...`);
      return;
    }

    // Guardar los partidos
    for (const match of matches) {
      const [homeTeam] = await Team.findOrCreate({
        where: { name: match.homeTeam.name },
      });

      const [awayTeam] = await Team.findOrCreate({
        where: { name: match.awayTeam.name },
      });

      await Match.findOrCreate({
        where: { external_id: match.id },
        defaults: {
          external_id: match.id,
          match_date: match.utcDate,
          matchday: match.matchday ?? null,
          round: match.stage ?? null,
          status: match.status?.toLowerCase() || 'finished',
          home_score: match.score.fullTime.home ?? 0,
          away_score: match.score.fullTime.away ?? 0,
          home_score_fulltime: match.score.fullTime.home ?? 0,
          away_score_fulltime: match.score.fullTime.away ?? 0,
          competition_id: competition.id,
          home_team_id: homeTeam.id,
          away_team_id: awayTeam.id,
          last_updated: new Date(),
        },
      });
    }

  } catch (error) {
    console.error(`❌ Error en ${competitionName}:`, error.response?.data || error.message);
  }
}

async function main() {
  try {
    console.log('📅 Iniciando recopilación de partidos finalizados...\n');
    for (const comp of COMPETITIONS) {
      await fetchPastMatches(comp.code, comp.name);
      await new Promise((res) => setTimeout(res, 6000)); // Espera 6 seg entre requests
    }
    console.log('\n🎉 Recopilación de partidos completada.');
  } catch (err) {
    console.error('❌ Error general:', err.message);
  } finally {
    await sequelize.close();
  }
}

main();
