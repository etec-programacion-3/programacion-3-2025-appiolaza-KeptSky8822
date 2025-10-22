const express = require('express');
const router = express.Router();
const {
  getAllTeams,
  getTeamById,
  getCompetitionsByTeam
} = require('../controllers/equiposController');

// Rutas
router.get('/', getAllTeams);                 // Listar todos los equipos
router.get('/:id', getTeamById);             // Obtener un equipo por ID
router.get('/:id/competitions', getCompetitionsByTeam); // Competiciones del equipo

module.exports = router;
