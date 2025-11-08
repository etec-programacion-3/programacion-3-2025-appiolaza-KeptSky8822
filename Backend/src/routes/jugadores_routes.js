const express = require('express');
const router = express.Router();
const jugadoresController = require('../controllers/jugadoresController');

// Rutas
router.get('/', jugadoresController.getAllPlayers);
router.get('/search', jugadoresController.searchPlayers);
router.get('/:id', jugadoresController.getPlayerById);
router.get('/:id/statistics', jugadoresController.getPlayerStatistics);



module.exports = router;
