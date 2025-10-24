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
          { model: Team, attributes: ['name'] },
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
  }
};
