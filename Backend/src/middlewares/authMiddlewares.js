const jwt = require('jsonwebtoken');
const { User } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiala';

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No autorizado' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    req.user = user; // guardamos el usuario en la request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
