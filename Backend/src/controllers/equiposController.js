const { Team, Competition } = require('../models');

module.exports = {
  // Obtener todos los equipos con paginación
  async getAllTeams(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: teams } = await Team.findAndCountAll({
        limit,
        offset
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        data: teams,
        pagination: {
          total: count,
          page,
          limit,
          totalPages
        }
      });
    } catch (error) {
      console.error('Error al obtener equipos:', error);
      res.status(500).json({ error: 'Error al obtener equipos' });
    }
  },

  // Obtener un equipo por ID
  async getTeamById(req, res) {
    try {
      const { id } = req.params;
      const team = await Team.findByPk(id);

      if (!team) return res.status(404).json({ error: 'Equipo no encontrado' });

      res.json(team);
    } catch (error) {
      console.error('Error al obtener el equipo:', error);
      res.status(500).json({ error: 'Error al obtener el equipo' });
    }
  },

  // Obtener competiciones de un equipo
async getCompetitionsByTeam(req, res) {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id, {
      include: [
        {
          model: Competition,
          through: { attributes: [] } // evita devolver columnas de competition_standings
        }
      ]
    });

    if (!team) return res.status(404).json({ error: 'Equipo no encontrado' });

    res.json({
      team: team.name,
      competitions: team.Competitions
    });
  } catch (error) {
    console.error('Error al obtener competiciones del equipo:', error);
    res.status(500).json({ error: 'Error al obtener competiciones del equipo' });
  }
}
};
