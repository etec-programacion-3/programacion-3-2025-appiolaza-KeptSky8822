// backend/src/services/fetchTeams.js
const apiClient = require('./apiFootballService');
const { Team } = require('../models');

async function fetchTeams(competitionCode, season) {
  try {
    const response = await apiClient.get(`/competitions/${competitionCode}/teams`);

    const teams = response.data.teams || [];

    for (const t of teams) {
      await Team.upsert({
        name: t.name,
        code: t.tla,
        country: t.area?.name || null,
        city: t.venue || null,
        stadium: t.venue || null,
        logo_url: t.crest,
        market_value: null, // Esta API no proporciona valor de mercado
        external_id: t.id,
        last_updated: new Date()
      });
    }

    console.log(`Se han sincronizado ${teams.length} equipos.`);
  } catch (error) {
    console.error('Error fetching teams:', error.response?.data || error.message);
  }
}

module.exports = { fetchTeams };
