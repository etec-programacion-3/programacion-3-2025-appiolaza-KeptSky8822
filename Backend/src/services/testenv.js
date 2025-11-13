// backend/src/services/testEnv.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });


console.log('FOOTBALL_API_URL:', process.env.FOOTBALL_API_URL);
console.log('FOOTBALL_API_KEY:', process.env.FOOTBALL_API_KEY ? '✅ Cargada' : '❌ No cargada');
