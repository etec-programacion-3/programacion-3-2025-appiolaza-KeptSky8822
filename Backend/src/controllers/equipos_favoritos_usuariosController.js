const { Team, Player } = require('../models');

module.exports = {
  // Obtener equipos favoritos
  async getUserFavorites(req, res) {
    try {
      const user = req.user;
      const favorites = await user.getFavoriteTeams({ joinTableAttributes: [] });

      if (!favorites.length) return res.status(404).json({ message: 'No hay equipos favoritos.' });
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Agregar equipo favorito
  async addFavorite(req, res) {
    try {
      const user = req.user;
      const { teamId } = req.body;

      const team = await Team.findByPk(teamId);
      if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });

      await user.addFavoriteTeam(team);
      res.status(201).json({ message: 'Equipo agregado a favoritos.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar equipo favorito
  async removeFavorite(req, res) {
    try {
      const user = req.user;
      const { teamId } = req.params;

      const team = await Team.findByPk(teamId);
      if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });

      await user.removeFavoriteTeam(team);
      res.json({ message: 'Equipo eliminado de favoritos.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
