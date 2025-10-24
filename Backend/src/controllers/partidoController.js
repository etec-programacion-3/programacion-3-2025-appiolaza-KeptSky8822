// src/controllers/matchController.js
const Match = require('../models/partido');
const Team = require('../models/equipo');
const Competition = require('../models/competicion');
const { Op } = require('sequelize'); // ✅ Importar Op para filtros

const matchController = {
  // 🧾 Obtener todos los partidos con paginación
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: matches } = await Match.findAndCountAll({
        include: [
          { model: Team, as: 'homeTeam', attributes: ['id', 'name'] },
          { model: Team, as: 'awayTeam', attributes: ['id', 'name'] },
          { model: Competition, attributes: ['id', 'name'] }
        ],
        order: [['match_date', 'DESC']],
        limit,
        offset
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        data: matches,
        pagination: {
          total: count,
          page,
          limit,
          totalPages
        }
      });
    } catch (error) {
      console.error('❌ Error al obtener partidos:', error);
      res.status(500).json({ message: 'Error al obtener los partidos' });
    }
  },

  // 🔍 Obtener un partido por ID
  getById: async (req, res) => {
    try {
      const match = await Match.findByPk(req.params.id, {
        include: [
          { model: Team, as: 'homeTeam', attributes: ['id', 'name'] },
          { model: Team, as: 'awayTeam', attributes: ['id', 'name'] },
          { model: Competition, attributes: ['id', 'name'] }
        ]
      });

      if (!match) return res.status(404).json({ message: 'Partido no encontrado' });

      res.json(match);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar el partido' });
    }
  },

  // ➕ Crear un nuevo partido
  create: async (req, res) => {
    try {
      const match = await Match.create(req.body);
      res.status(201).json(match);
    } catch (error) {
      console.error('❌ Error al crear partido:', error);
      res.status(400).json({ message: 'Error al crear el partido', error });
    }
  },

  // ✏️ Actualizar un partido
  update: async (req, res) => {
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
  remove: async (req, res) => {
    try {
      const match = await Match.findByPk(req.params.id);
      if (!match) return res.status(404).json({ message: 'Partido no encontrado' });

      await match.destroy();
      res.json({ message: '🗑️ Partido eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el partido', error });
    }
  },

  // 🔎 Obtener partidos filtrando por fecha y/o competición con paginación
  async getMatches(req, res) {
  try {
    const { date, competition, page = 1, limit = 10 } = req.query;
    const where = {};
    const offset = (page - 1) * limit;

    if (date) {
      // Convertimos la fecha a UTC para el inicio y fin del día
      const startOfDay = new Date(date + 'T00:00:00.000Z'); // inicio del día UTC
      const endOfDay = new Date(date + 'T23:59:59.999Z');   // fin del día UTC

      where.match_date = {
        [Op.between]: [startOfDay, endOfDay]
      };
    }

    if (competition) {
      where.competition_id = competition;
    }

    const { count, rows: matches } = await Match.findAndCountAll({
      where,
      include: [
        { model: Team, as: 'homeTeam', attributes: ['id', 'name'] },
        { model: Team, as: 'awayTeam', attributes: ['id', 'name'] },
        { model: Competition, attributes: ['id', 'name'] }
      ],
      order: [['match_date', 'ASC']],
      limit: parseInt(limit),
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      data: matches,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener calendario de partidos:', error);
    res.status(500).json({ message: 'Error al obtener los partidos', error });
  }
}
};

module.exports = matchController;
