const { Player, Team, PlayerStatistics } = require('../models');

module.exports = {
  // Obtener todos los jugadores con paginación
  async getAllPlayers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: players } = await Player.findAndCountAll({
        include: [{ model: Team, attributes: ['name'] }],
        limit,
        offset
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        data: players,
        pagination: {
          total: count,
          page,
          limit,
          totalPages
        }
      });
    } catch (error) {
      console.error('Error al obtener jugadores:', error);
      res.status(500).json({ error: 'Error al obtener jugadores' });
    }
  },

  // Obtener jugador por ID
  async getPlayerById(req, res) {
    try {
      const { id } = req.params;
      const player = await Player.findByPk(id, {
        include: [
          { model: Team, attributes: ['name','logo_url'] },
          { model: PlayerStatistics }
        ]
      });

      if (!player) return res.status(404).json({ error: 'Jugador no encontrado' });

      res.json(player);
    } catch (error) {
      console.error('Error al obtener jugador:', error);
      res.status(500).json({ error: 'Error al obtener jugador' });
    }
  },

  // Obtener estadísticas del jugador
  async getPlayerStatistics(req, res) {
    try {
      const { id } = req.params;
      const stats = await PlayerStatistics.findOne({
        where: { player_id: id }
      });

      if (!stats) return res.status(404).json({ error: 'Estadísticas no encontradas' });

      res.json(stats);
    } catch (error) {
      console.error('Error al obtener estadísticas del jugador:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas del jugador' });
    }
  },
  // Buscar jugadores por nombre, apellido o nombre completo
  async searchPlayers(req, res) {
    try {
      const { q } = req.query; // El texto que se busca (por ejemplo "Lionel Messi")
      if (!q) return res.status(400).json({ error: 'Falta el parámetro de búsqueda (q)' });

      const { Op } = require('sequelize');
      const players = await Player.findAll({
        where: {
          [Op.or]: [
            { first_name: { [Op.like]: `%${q}%` } },
            { last_name: { [Op.like]: `%${q}%` } },
            { display_name: { [Op.like]: `%${q}%` } } // si tenés este campo en tu modelo
          ]
        },
        include: [{ model: Team, attributes: ['name','logo_url'] }]
      });

      if (players.length === 0) return res.status(404).json({ message: 'No se encontraron jugadores' });

      res.json(players);
    } catch (error) {
      console.error('Error en búsqueda de jugadores:', error);
      res.status(500).json({ error: 'Error en la búsqueda de jugadores' });
    }
  }

};
