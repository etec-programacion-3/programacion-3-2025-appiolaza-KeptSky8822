const MatchEvent = require('../models/partidoevent');

module.exports = {
  // Obtener todos los eventos con paginación
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: events } = await MatchEvent.findAndCountAll({
        include: ['Match', 'Player', 'Team'], // Incluye relaciones
        limit,
        offset
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        data: events,
        pagination: {
          total: count,
          page,
          limit,
          totalPages
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un evento por ID
  async getById(req, res) {
    try {
      const event = await MatchEvent.findByPk(req.params.id, {
        include: ['Match', 'Player', 'Team']
      });
      if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un evento
  async create(req, res) {
    try {
      const { match_id, player_id, team_id, minute, event_type, description } = req.body;
      const newEvent = await MatchEvent.create({ match_id, player_id, team_id, minute, event_type, description });
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un evento
  async update(req, res) {
    try {
      const event = await MatchEvent.findByPk(req.params.id);
      if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

      const { match_id, player_id, team_id, minute, event_type, description } = req.body;
      await event.update({ match_id, player_id, team_id, minute, event_type, description });
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un evento
  async delete(req, res) {
    try {
      const event = await MatchEvent.findByPk(req.params.id);
      if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

      await event.destroy();
      res.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
