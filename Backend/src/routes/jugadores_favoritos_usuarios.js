// src/routes/favoritePlayers.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/jugadores_favoritos_usuariosController');
const authenticateToken = require('../middlewares/authMiddlewares');

// Rutas protegidas para jugadores favoritos
router.get('/', authenticateToken, favoriteController.getUserFavorites); // Obtener jugadores favoritos del usuario
router.post('/', authenticateToken, favoriteController.addFavorite);    // Agregar jugador favorito (body: { playerId })
router.delete('/:id', authenticateToken, favoriteController.removeFavorite); // Eliminar jugador favorito por id del favorito

module.exports = router;
