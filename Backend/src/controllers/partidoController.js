// src/controllers/matchController.js
const Match = require('../models/partido');
const Team = require('../models/equipo');
const Competition = require('../models/competicion');

const matchController = {
  // 🧾 Obtener todos los partidos
  async getAll(req, res) {
    try {
      const matches = await Match.findAll({
        include: [
          { model: Team, as: 'homeTeam', attributes: ['id', 'name'] },
          { model: Team, as: 'awayTeam', attributes: ['id', 'name'] },
          { model: Competition, attributes: ['id', 'name'] }
        ],
        order: [['match_date', 'DESC']]
      });
      res.json(matches);
    } catch (error) {
      console.error('❌ Error al obtener partidos:', error);
      res.status(500).json({ message: 'Error al obtener los partidos' });
    }
  },

  // 🔍 Obtener un partido por ID
  async getById(req, res) {
    try {
      const match = await Match.findByPk(req.params.id, {
        include: [
          { model: Team, as: 'homeTeam', attributes: ['id', 'name'] },
          { model: Team, as: 'awayTeam', attributes: ['id', 'name'] },
          { model: Competition, attributes: ['id', 'name'] }
        ]
      });

      if (!match) {
        return res.status(404).json({ message: 'Partido no encontrado' });
      }

      res.json(match);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar el partido' });
    }
  },

  // ➕ Crear un nuevo partido
  async create(req, res) {
    try {
      const match = await Match.create(req.body);
      res.status(201).json(match);
    } catch (error) {
      console.error('❌ Error al crear partido:', error);
      res.status(400).json({ message: 'Error al crear el partido', error });
    }
  },

  // ✏️ Actualizar un partido
  async update(req, res) {
    try {
      const match = await Match.findByPk(req.params.id);
      if (!match) return res.status(404).json({ message: 'Partido no encontrado' });

      await match.update(req.body);
      res.json({ message: '✅ Partido actualizado', match });
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar el partido', error });
    }
  },

  // ❌ Eliminar un partido
  async remove(req, res) {
    try {
      const match = await Match.findByPk(req.params.id);
      if (!match) return res.status(404).json({ message: 'Partido no encontrado' });

      await match.destroy();
      res.json({ message: '🗑️ Partido eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el partido', error });
    }
  }
};

module.exports = matchController;
