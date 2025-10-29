// backend/src/services/fetchMatches.js
const apiClient = require('./apiFootballService');
const { Match, Team } = require('../models');

async function fetchMatches(competitionCode, season) {
  try {
    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

    // Fetch all matches for the competition
    const allResponse = await apiClient.get(`/competitions/${competitionCode}/matches?limit=200`);
    const allMatches = allResponse.data.matches || [];

    // For Champions League, get all matches (both played and upcoming)
    // For other competitions, filter for upcoming only
    let matches;
    if (competitionCode === 'CL' || competitionCode === 2001) {
      // Get all Champions League matches
      matches = allMatches;
    } else {
      // For other competitions, filter for upcoming matches
      matches = allMatches.filter(match =>
        match.status !== 'FINISHED' &&
        match.status !== 'AWARDED' &&
        match.status !== 'CANCELLED'
      );
    }

    for (const m of matches) {
      // Map external team IDs to internal database IDs
      let homeTeamId = null;
      let awayTeamId = null;

      if (m.homeTeam?.id) {
        const homeTeam = await Team.findOne({ where: { external_id: m.homeTeam.id } });
        homeTeamId = homeTeam ? homeTeam.id : null;
      }

      if (m.awayTeam?.id) {
        const awayTeam = await Team.findOne({ where: { external_id: m.awayTeam.id } });
        awayTeamId = awayTeam ? awayTeam.id : null;
      }

      await Match.upsert({
        match_date: new Date(m.utcDate),
        matchday: m.matchday || null,
        status: m.status.toLowerCase(),
        home_score: m.score?.fullTime?.home || null,
        away_score: m.score?.fullTime?.away || null,
        home_score_halftime: m.score?.halfTime?.home || null,
        away_score_halftime: m.score?.halfTime?.away || null,
        venue: m.venue?.name || null,
        city: m.venue?.city || null,
        referee: m.referees?.[0]?.name || null,
        external_id: m.id.toString(),
        competition_id: m.competition?.id || null,
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        last_updated: new Date()
      });
    }

    console.log(`Se han sincronizado ${matches.length} partidos de la liga ${competitionCode}.`);
  } catch (error) {
    console.error('Error fetching matches:', error.response?.data || error.message);
  }
}

module.exports = { fetchMatches };