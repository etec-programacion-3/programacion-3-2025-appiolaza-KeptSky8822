require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const axios = require('axios');

const api = axios.create({
  baseURL: process.env.FOOTBALL_API_URL,
  headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY }
});

const competitions = [
  { code: 'CL', name: 'Champions League' },
  { code: 'PL', name: 'Premier League' },
  { code: 'PD', name: 'La Liga' },
  { code: 'BL1', name: 'Bundesliga' },
  { code: 'SA', name: 'Serie A' },
  { code: 'FL1', name: 'Ligue 1' }
];

(async () => {
  console.log('🔍 Probando acceso a competiciones...\n');
  
  for (const c of competitions) {
    try {
      const res = await api.get(`/competitions/${c.code}`);
      console.log(`✅ ${c.name} (${c.code}) accesible`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.log(`❌ ${c.name} (${c.code}) no accesible → ${msg}`);
    }
  }
})();
