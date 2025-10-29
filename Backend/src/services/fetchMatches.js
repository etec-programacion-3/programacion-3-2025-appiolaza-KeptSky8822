// backend/src/services/fetchMatches.js
const apiClient = require('./apiFootballService');
const { Match } = require('../models');

async function fetchMatches(competitionCode, season) {
  try {
    const response = await apiClient.get(`/competitions/${competitionCode}/matches?status=SCHEDULED&limit=50`);

    const matches = response.data.matches || [];

    for (const m of matches) {
      await Match.upsert({
        match_date: new Date(m.utcDate),
        status: m.status,
        home_score: m.score?.fullTime?.home || null,
        away_score: m.score?.fullTime?.away || null,
        venue: null, // Esta API no proporciona venue
        referee: m.referees?.[0]?.name || null,
        external_id: m.id,
        competition_id: m.competition?.id || null,
        home_team_id: m.homeTeam?.id || null,
        away_team_id: m.awayTeam?.id || null,
        last_updated: new Date()
      });
    }

    console.log(`Se han sincronizado ${matches.length} partidos de la liga ${competitionCode}.`);
  } catch (error) {
    console.error('Error fetching matches:', error.response?.data || error.message);
  }
}

module.exports = { fetchMatches };