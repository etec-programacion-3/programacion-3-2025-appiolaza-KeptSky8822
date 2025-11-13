// backend/src/services/apiFootballService.js
const axios = require('axios');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });


console.log('API URL:', process.env.FOOTBALL_API_URL); // Debug
console.log('API Key exists:', !!process.env.FOOTBALL_API_KEY); // Debug

const apiClient = axios.create({
  baseURL: process.env.FOOTBALL_API_URL,
  headers: {
    'X-Auth-Token': process.env.FOOTBALL_API_KEY
  }
});

module.exports = apiClient;
