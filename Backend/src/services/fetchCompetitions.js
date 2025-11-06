// backend/src/services/fetchCompetitions.js
const apiClient = require('./apiFootballService');
const { Competition } = require('../models');

async function fetchCompetitions() {
  try {
    // Solo sincronizar las 4 competiciones específicas
    const targetCompetitions = [
        { code: 'CL', name: 'UEFA Champions League', season: 2025 },
        { code: 'PD', name: 'La Liga', season: 2025 },
        { code: 'PL', name: 'Premier League', season: 2025 },
        { code: 'BL1', name: 'Bundesliga', season: 2025 },
        { code: 'SA', name: 'Serie A', season: 2025 },
        { code: 'FL1', name: 'Ligue 1', season: 2025 }
    ];

    for (const comp of targetCompetitions) {
      const response = await apiClient.get(`/competitions/${comp.code}`);

      if (response.data) {
        const c = response.data;

        await Competition.upsert({
          id: c.id, // Usar el ID real de la API
          name: c.name,
          short_name: c.code,
          country: c.area?.name || 'International',
          season: 2025, // Temporada 2024/25 -> 2025
          type: c.type?.toLowerCase() || 'league',
          dates: JSON.stringify({ currentSeason: c.currentSeason }),
          logo_url: c.emblem,
          status: 'ongoing', // Temporada actual en curso
          last_updated: new Date()
        });
      }
    }

    console.log(`Se han sincronizado ${targetCompetitions.length} competencias específicas.`);
  } catch (error) {
    console.error('Error fetching competitions:', error.response?.data || error.message);
  }
}

module.exports = { fetchCompetitions };
