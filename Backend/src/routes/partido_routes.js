// src/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/partidoController');

// Rutas CRUD
router.get('/', matchController.getAll);
// Obtener calendario de partidos
router.get('/calendar', matchController.getMatches);

router.get('/:id', matchController.getById);
router.post('/', matchController.create);
router.put('/:id', matchController.update);
router.delete('/:id', matchController.remove);

module.exports = router;
