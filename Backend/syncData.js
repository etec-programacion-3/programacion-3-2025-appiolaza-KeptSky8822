// backend/syncData.js
require('dotenv').config();
const { fetchCompetitions } = require('./src/services/fetchCompetitions');
const { fetchTeams } = require('./src/services/fetchTeams');
const { fetchMatches } = require('./src/services/fetchMatches');

async function syncAll() {
  try {
    console.log('🔹 Sincronizando competencias...');
    await fetchCompetitions();

    console.log('🔹 Sincronizando equipos (UEFA Champions League)...');
    await fetchTeams('CL', 2025);

    console.log('🔹 Sincronizando equipos (La Liga)...');
    await fetchTeams('PD', 2025);

    console.log('🔹 Sincronizando equipos (CONMEBOL Libertadores)...');
    await fetchTeams('CLI', 2025);

    console.log('🔹 Sincronizando equipos (Premier League)...');
    await fetchTeams('PL', 2025);

    console.log('🔹 Sincronizando partidos (UEFA Champions League)...');
    await fetchMatches('CL', 2025);

    console.log('🔹 Sincronizando partidos (La Liga)...');
    await fetchMatches('PD', 2025);

    console.log('🔹 Sincronizando partidos (CONMEBOL Libertadores)...');
    await fetchMatches('CLI', 2025);

    console.log('🔹 Sincronizando partidos (Premier League)...');
    await fetchMatches('PL', 2025);

    console.log('🔹 Sincronizando posiciones de Champions League...');
    const { syncStandings } = require('./src/services/syncStandings');
    await syncStandings('CL');

    console.log('✅ Sincronización completada!');
  } catch (error) {
    console.error('❌ Error en la sincronización:', error);
  }
  process.exit();
}

syncAll();
