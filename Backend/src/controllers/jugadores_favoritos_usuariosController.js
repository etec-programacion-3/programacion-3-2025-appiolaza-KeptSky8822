// src/controllers/jugadores_favoritos_usuariosController.js
const { FavoritePlayer } = require('../models');

const favoritePlayerController = {

  // Obtener todos los jugadores favoritos del usuario
  getUserFavorites: async (req, res) => {
    try {
      const user = req.user; // viene del middleware de autenticación

      // Solo traer los jugadores favoritos, sin includes
      const favorites = await user.getFavoritePlayers();

      res.json(favorites);
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      res.status(500).json({ message: 'Error al obtener jugadores favoritos' });
    }
  },

  // Agregar un jugador favorito
  addFavorite: async (req, res) => {
    try {
      const user = req.user;
      const { playerId } = req.body;

      if (!playerId) return res.status(400).json({ message: 'Debe enviar playerId' });

      // Verificar si ya está en favoritos
      const exists = await FavoritePlayer.findOne({
        where: { userId: user.id, playerId }
      });

      if (exists) return res.status(400).json({ message: 'Jugador ya en favoritos' });

      const favorite = await FavoritePlayer.create({ userId: user.id, playerId });
      res.status(201).json(favorite);
    } catch (error) {
      console.error('Error al agregar favorito:', error);
      res.status(500).json({ message: 'Error al agregar jugador favorito' });
    }
  },

  // Eliminar un favorito
// Eliminar un favorito
removeFavorite: async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params; // <-- cambiar playerId por id

        const deleted = await FavoritePlayer.destroy({
        where: { userId: user.id, playerId: id } // <-- la columna sigue siendo playerId
        });

        if (!deleted) return res.status(404).json({ message: 'Favorito no encontrado' });

        res.json({ message: 'Jugador eliminado de favoritos' });
    } catch (error) {
        console.error('Error al eliminar favorito:', error);
        res.status(500).json({ message: 'Error al eliminar jugador favorito' });
    }
    }
};


module.exports = favoritePlayerController;
