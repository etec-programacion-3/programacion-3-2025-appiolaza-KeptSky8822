const { User, Team, FavoriteTeam } = require('../models');

// ➡️ Obtener equipos favoritos de un usuario
exports.getUserFavorites = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: {
        model: Team,
        as: 'favoriteTeams', // coincide con la asociación en index.js
        through: { attributes: [] } // oculta los datos de la tabla intermedia
      }
    });

    if (!user || !user.favoriteTeams.length)
      return res.status(404).json({ message: 'No hay equipos favoritos para este usuario.' });

    res.json(user.favoriteTeams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➕ Agregar equipo favorito
exports.addFavorite = async (req, res) => {
  try {
    const { userId } = req.params;
    const { team_id } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // addTeam es un método generado por Sequelize por la asociación Many-to-Many
    const team = await Team.findByPk(team_id);
    if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });

    await user.addFavoriteTeam(team); 
    res.status(201).json({ message: 'Equipo agregado a favoritos.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Eliminar equipo favorito
exports.removeFavorite = async (req, res) => {
  try {
    const { userId, teamId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const team = await Team.findByPk(teamId);
    if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });

    await user.removeFavoriteTeam(team);
    res.json({ message: 'Equipo eliminado de favoritos.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
