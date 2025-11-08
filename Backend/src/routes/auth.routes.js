const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddlewares');

// Registro e inicio de sesión
router.post('/register', authController.register);
router.post('/login', authController.login);

// Obtener usuario actual (protegido)
router.get('/me', authenticateToken, authController.getCurrentUser);

// Logout (opcional)
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;