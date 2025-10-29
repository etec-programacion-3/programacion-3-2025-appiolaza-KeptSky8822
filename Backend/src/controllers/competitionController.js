// src/controllers/competitionController.js
const { Competition, Team } = require('../models');
const fetchScorers = require('../services/fetchScorers');

module.exports = {
  // Obtener todas las competiciones con paginación
  async getAllCompetitions(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: competitions } = await Competition.findAndCountAll({
        limit,
        offset
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        data: competitions,
        pagination: {
          total: count,
          page,
          limit,
          totalPages
        }
      });
    } catch (error) {
      console.error('Error al obtener competiciones:', error);
      res.status(500).json({ error: 'Error al obtener competiciones' });
    }
  },

  // Obtener una competición por ID
  async getCompetitionById(req, res) {
    try {
      const { id } = req.params;
      const competition = await Competition.findByPk(id);

      if (!competition) {
        return res.status(404).json({ error: 'Competición no encontrada' });
      }

      res.json(competition);
    } catch (error) {
      console.error('Error al obtener la competición:', error);
      res.status(500).json({ error: 'Error al obtener la competición' });
    }
  },

  // Obtener equipos de una competición
  async getTeamsByCompetition(req, res) {
    try {
      const { id } = req.params;
      const competition = await Competition.findByPk(id, {
        include: [{ model: Team }]
      });

      if (!competition) {
        return res.status(404).json({ error: 'Competición no encontrada' });
      }

      res.json({
        competition: competition.name,
        teams: competition.Teams
      });
    } catch (error) {
      console.error('Error al obtener equipos:', error);
      res.status(500).json({ error: 'Error al obtener equipos de la competición' });
    }
  },

  // Fetch and save scorers for a competition
  async fetchScorersForCompetition(req, res) {
    try {
      const { id } = req.params;
      const { season } = req.query; // e.g., 2024

      if (!season) {
        return res.status(400).json({ error: 'Season parameter is required' });
      }

      const competition = await Competition.findByPk(id);
      if (!competition) {
        return res.status(404).json({ error: 'Competición no encontrada' });
      }

      // Run the fetch in background
      fetchScorers(id, season);

      res.json({ message: `Fetching scorers for competition ${competition.name} in season ${season}` });
    } catch (error) {
      console.error('Error triggering scorers fetch:', error);
      res.status(500).json({ error: 'Error al iniciar la obtención de goleadores' });
    }
  }
};
