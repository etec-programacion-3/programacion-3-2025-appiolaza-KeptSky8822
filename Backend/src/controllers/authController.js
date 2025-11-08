const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiala';

module.exports = {
  // Registro
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password)
        return res.status(400).json({ message: 'Todos los campos son requeridos' });

      if (password.length < 6)
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });

      // Validar usuario y email únicos
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: 'Email ya registrado' });

      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) return res.status(400).json({ message: 'Nombre de usuario en uso' });

      // Hash de contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Crear usuario
      const newUser = await User.create({ username, email, password: hashedPassword });

      // Generar token
      const token = jwt.sign({ id: newUser.id, email, username }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        token,
        user: { id: newUser.id, username, email, createdAt: newUser.createdAt }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Email y contraseña requeridos' });

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ message: 'Credenciales incorrectas' });

      const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ message: 'Login exitoso', token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
  },

  // Obtener usuario actual
  async getCurrentUser(req, res) {
    try {
      const user = req.user; // viene del middleware JWT
      res.json({ user: { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt } });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
  },

  // Logout opcional
  logout(req, res) {
    res.json({ message: 'Logout exitoso' });
  }
};
