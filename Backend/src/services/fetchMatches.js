// backend/src/services/fetchAllMatches.js
const apiClient = require('./apiFootballService');
const { Match, Team, Competition } = require('../models'); // Asumo que tienes modelo Competition
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchMatchesForCompetition(competition) {
  try {
    if (!competition.short_name) {
      console.log(`⚠️ Competencia ${competition.name} no tiene short_name definido. Se omite.`);
      return;
    }

    console.log(`🔄 Sincronizando partidos de ${competition.name} (${competition.short_name})...`);

    await delay(2000); // espera inicial para no saturar

    const response = await apiClient.get(`/competitions/${competition.short_name}/matches`);
    const allMatches = response.data.matches || [];

    // Para Champions League ('CL'), incluimos todos los partidos
    const matches =
      competition.short_name === 'CL'
        ? allMatches
        : allMatches.filter(m =>
            !['FINISHED', 'AWARDED', 'CANCELLED'].includes(m.status)
          );

    for (const m of matches) {
      try {
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
          home_score: m.score?.fullTime?.home ?? null,
          away_score: m.score?.fullTime?.away ?? null,
          home_score_halftime: m.score?.halfTime?.home ?? null,
          away_score_halftime: m.score?.halfTime?.away ?? null,
          venue: m.venue || null,
          city: m.area?.name || null,
          referee: m.referees?.[0]?.name || null,
          external_id: m.id.toString(),
          competition_id: competition.id,
          home_team_id: homeTeamId,
          away_team_id: awayTeamId,
          last_updated: new Date()
        });

      } catch (matchError) {
        console.error(`❌ Error procesando partido ${m.id}:`, matchError.message);
      }

      await delay(6000); // espera entre partidos para respetar límite de requests
    }

    console.log(`✅ ${matches.length} partidos sincronizados de ${competition.name}.\n`);

  } catch (error) {
    if (error.response?.status === 429) {
      const waitText = error.response.data?.message || '';
      const match = waitText.match(/Wait (\d+) seconds/);
      const waitSeconds = match ? parseInt(match[1]) : 60;
      console.log(`⏳ Límite alcanzado. Esperando ${waitSeconds} segundos...`);
      await delay(waitSeconds * 1000);
      return fetchMatchesForCompetition(competition); // reintento
    }
    console.error(`❌ Error general en ${competition.name}:`, error.response?.data || error.message);
  }
}

async function fetchAllCompetitionsMatches() {
  try {
    const competitions = await Competition.findAll({ where: { is_active: true } });
    console.log(`⚽ Se encontraron ${competitions.length} competencias activas.\n`);

    for (const [index, competition] of competitions.entries()) {
      console.log(`🔹 Competencia ${index + 1}/${competitions.length}`);
      await fetchMatchesForCompetition(competition);
    }

    console.log('🎉 Sincronización de todos los partidos completada.');
  } catch (error) {
    console.error('❌ Error general al obtener competencias:', error.message);
  }
}

// Ejecuta si el archivo se corre directamente
if (require.main === module) {
  fetchAllCompetitionsMatches();
}

module.exports = { fetchAllCompetitionsMatches };
