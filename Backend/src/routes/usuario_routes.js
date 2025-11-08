const express = require('express');
const router = express.Router();
const userController = require('../controllers/usuarioController');
const authenticateToken = require('../middlewares/authMiddlewares');

// CRUD de usuarios
router.get('/', authenticateToken, userController.getAll);
router.get('/:id', authenticateToken, userController.getById);
router.post('/', authenticateToken, userController.create); // opcional: solo admin
router.put('/:id', authenticateToken, userController.update);
router.delete('/:id', authenticateToken, userController.delete);

module.exports = router;
