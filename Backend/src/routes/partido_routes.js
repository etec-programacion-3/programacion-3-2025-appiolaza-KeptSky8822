// src/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/partidoController');

// Rutas CRUD
router.get('/', matchController.getAll);
// Obtener calendario de partidos
router.get('/calendar', matchController.getMatches);

// 🆕 Nuevas rutas para las 4 competiciones principales
router.get('/live', matchController.getLiveMatches);
router.get('/upcoming', matchController.getUpcomingMatches);
router.get('/competition/:competitionId', matchController.getMatchesByCompetition);

router.get('/:id', matchController.getById);
router.post('/', matchController.create);
router.put('/:id', matchController.update);
router.delete('/:id', matchController.remove);

module.exports = router;
