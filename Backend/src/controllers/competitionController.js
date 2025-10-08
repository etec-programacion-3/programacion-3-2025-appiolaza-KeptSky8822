// src/controllers/competitionController.js
const { Competition, Equipo } = require('../models');

module.exports = {
  // Obtener todas las competiciones
  async getAllCompetitions(req, res) {
    try {
      const competitions = await Competition.findAll();
      res.json(competitions);
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
        include: [{ model: Equipo }]
      });

      if (!competition) {
        return res.status(404).json({ error: 'Competición no encontrada' });
      }

      res.json({
        competition: competition.name,
        teams: competition.Equipos
      });
    } catch (error) {
      console.error('Error al obtener equipos:', error);
      res.status(500).json({ error: 'Error al obtener equipos de la competición' });
    }
  }
};
