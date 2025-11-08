const bcrypt = require('bcryptjs');
const { User } = require('../models');

module.exports = {
  // Listar usuarios con paginación
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: users } = await User.findAndCountAll({
        limit,
        offset,
        attributes: ['id','username','email','createdAt']
      });
      const totalPages = Math.ceil(count / limit);

      res.json({ data: users, pagination: { total: count, page, limit, totalPages } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtener usuario por id
  async getById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, { attributes: ['id','username','email','createdAt'] });
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Crear usuario (opcional admin)
  async create(req, res) {
    try {
      const { username, email, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({ username, email, password: hashedPassword });
      res.status(201).json({ id: newUser.id, username, email, createdAt: newUser.createdAt });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar usuario
  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const { username, email, password } = req.body;
      const updateData = { username, email };
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      await user.update(updateData);
      res.json({ id: user.id, username, email, updatedAt: user.updatedAt });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar usuario
  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      await user.destroy();
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
