const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/equipos_favoritos_usuariosController');

// Obtener todos los equipos favoritos de un usuario
router.get('/', controller.getUserFavorites);

// Agregar un equipo favorito
router.post('/', controller.addFavorite);

// Eliminar un equipo favorito
router.delete('/:teamId', controller.removeFavorite);

module.exports = router;
