const express = require('express');
const router = express.Router();
const userController = require('../controllers/usuarioController');
const favoriteteam_routes = require('./equipos_favoritos_usuarios')

// Rutas CRUD de usuarios
router.get('/', userController.getAll);         // Listar usuarios
router.get('/:id', userController.getById);     // Usuario por id
router.post('/', userController.create);        // Crear usuario
router.put('/:id', userController.update);      // Actualizar usuario
router.delete('/:id', userController.delete);   // Eliminar usuario
// Rutas de equipos favoritos
router.use('/:userId/favorite-teams', favoriteteam_routes);

module.exports = router;
