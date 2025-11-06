// backend/testSync.js
const autoUpdateService = require('./src/services/autoUpdateService');

async function test() {
  console.log('🔹 Iniciando prueba de sincronización manual...');
  await autoUpdateService.manualSync();
  console.log('🔹 Prueba completada.');
}

test();
