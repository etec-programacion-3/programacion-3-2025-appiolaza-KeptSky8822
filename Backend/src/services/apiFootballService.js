// backend/src/services/apiFootballService.js
const axios = require('axios');

const apiClient = axios.create({
  baseURL: process.env.FOOTBALL_API_URL,
  headers: {
    'X-Auth-Token': process.env.FOOTBALL_API_KEY
  }
});

module.exports = apiClient;
