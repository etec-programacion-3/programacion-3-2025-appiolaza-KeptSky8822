// backend/src/services/syncTeamsFromCompetitions.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { sequelize, Competition } = require('../models');
const { fetchTeams } = require('./fetchTeams');

(async () => {
  try {
    console.log('🔍 Buscando competiciones en la base de datos...');
    await sequelize.authenticate();

    const competitions = await Competition.findAll({
      attributes: ['short_name', 'name', 'season']
    });

    if (competitions.length === 0) {
      console.log('⚠️ No hay competiciones registradas en la base de datos.');
      process.exit(0);
    }

    console.log(`📦 Se encontraron ${competitions.length} competiciones.`);

    for (const comp of competitions) {
      console.log(`\n⚽ Sincronizando equipos para ${comp.name} (${comp.short_name})...`);
      await fetchTeams(comp.short_name, comp.season);
    }

    console.log('\n✅ Sincronización de equipos completada con éxito.');
  } catch (err) {
    console.error('❌ Error al sincronizar equipos:', err.message);
  } finally {
    await sequelize.close();
  }
})();
