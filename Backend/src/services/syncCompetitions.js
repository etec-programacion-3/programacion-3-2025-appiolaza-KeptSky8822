require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { sequelize } = require('../models');
const { fetchCompetitions } = require('./fetchCompetitions');

(async () => {
  try {
    console.log('🔄 Sincronizando competiciones...');
    await sequelize.authenticate();
    await fetchCompetitions();
    console.log('✅ Sincronización completada.');
  } catch (err) {
    console.error('❌ Error al sincronizar competiciones:', err.message);
  } finally {
    await sequelize.close();
  }
})();
