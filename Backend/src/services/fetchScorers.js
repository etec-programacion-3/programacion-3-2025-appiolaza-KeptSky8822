// backend/src/services/fetchScorers.js
const apiClient = require('./apiFootballService');
const { Player, PlayerStatistics, Competition } = require('../models');

async function fetchScorers(competitionId, season) {
  try {
    console.log(`Fetching scorers for competition ${competitionId}, season ${season}`);

    const response = await apiClient.get(`/competitions/${competitionId}/scorers`);
    const scorers = response.data.scorers || response.data; // Adjust based on API response structure

    if (!Array.isArray(scorers)) {
      console.error('Unexpected API response structure for scorers');
      return;
    }

    for (const scorer of scorers) {
      try {
        // Assuming scorer structure: { player: { id, name, firstName, lastName }, team: { id }, goals, assists, etc. }
        const playerData = scorer.player;
        const teamData = scorer.team;

        // Find or create player
        let player = await Player.findOne({ where: { external_id: playerData.id } });
        if (!player) {
          player = await Player.create({
            first_name: playerData.firstName || playerData.name?.split(' ')[0] || '',
            last_name: playerData.lastName || playerData.name?.split(' ').slice(1).join(' ') || '',
            display_name: playerData.name,
            external_id: playerData.id,
            team_id: teamData?.id, // Assuming team id is available
            nationality: playerData.nationality,
            position: playerData.position?.toLowerCase(),
            // Add other fields as needed
          });
        }

        // Upsert player statistics
        await PlayerStatistics.upsert({
          player_id: player.id,
          id_competition: competitionId,
          season: season,
          games_played: scorer.playedMatches || 0,
          goals: scorer.goals || 0,
          assists: scorer.assists || 0,
          // Add other stats if available in API
          last_updated: new Date(),
        });

        console.log(`Updated stats for player ${player.first_name} ${player.last_name}`);
      } catch (playerError) {
        console.error(`Error processing scorer ${scorer.player?.id}:`, playerError);
      }
    }

    console.log(`Successfully fetched and saved scorers for competition ${competitionId}`);
  } catch (error) {
    console.error('Error fetching scorers:', error);
  }
}

module.exports = fetchScorers;