// backend/src/services/syncPlayersFromTeams.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { sequelize, Team } = require('../models');
const { fetchPlayers } = require('./fetchAllPlayersFromSquads');

(async () => {
  try {
    console.log('🔍 Buscando equipos en la base de datos...');
    await sequelize.authenticate();

    const teams = await Team.findAll({
      attributes: ['id', 'name', 'external_id']
    });

    if (teams.length === 0) {
      console.log('⚠️ No hay equipos registrados en la base de datos.');
      process.exit(0);
    }

    console.log(`📦 Se encontraron ${teams.length} equipos.`);

    for (const team of teams) {
      console.log(`\n⚽ Cargando jugadores de ${team.name}...`);
      await fetchPlayers(team);
    }

    console.log('\n✅ Sincronización de jugadores completada con éxito.');
  } catch (err) {
    console.error('❌ Error al sincronizar jugadores:', err.message);
  } finally {
    await sequelize.close();
  }
})();
