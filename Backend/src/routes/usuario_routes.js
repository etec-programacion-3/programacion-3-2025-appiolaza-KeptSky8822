const express = require('express');
const router = express.Router();
const userController = require('../controllers/usuarioController');

// Rutas CRUD de usuarios
router.get('/', userController.getAll);         // Listar usuarios
router.get('/:id', userController.getById);     // Usuario por id
router.post('/', userController.create);        // Crear usuario
router.put('/:id', userController.update);      // Actualizar usuario
router.delete('/:id', userController.delete);   // Eliminar usuario

module.exports = router;
