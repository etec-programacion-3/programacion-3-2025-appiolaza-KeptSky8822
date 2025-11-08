const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/equipos_favoritos_usuariosController');
const authenticateToken = require('../middlewares/authMiddlewares');

// Favoritos protegidos
router.get('/', authenticateToken, favoriteController.getUserFavorites);
router.post('/', authenticateToken, favoriteController.addFavorite);
router.delete('/:teamId', authenticateToken, favoriteController.removeFavorite);

module.exports = router;
