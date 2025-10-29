// backend/src/services/apiFootballService.js
const axios = require('axios');

const apiClient = axios.create({
  baseURL: process.env.FOOTBALL_API_URL,
  headers: {
    'x-apisports-key': process.env.FOOTBALL_API_KEY
  }
});

module.exports = apiClient;
