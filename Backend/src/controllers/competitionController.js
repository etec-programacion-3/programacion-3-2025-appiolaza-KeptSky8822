// src/controllers/competitionController.js
const { Competition, Team, CompetitionStanding } = require('../models');
const { sequelize } = require('../models');
const fetchScorers = require('../services/fetchScorers');

module.exports = {
  // Obtener todas las competiciones con paginación
  async getAllCompetitions(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: competitions } = await Competition.findAndCountAll({
        limit,
        offset
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        data: competitions,
        pagination: {
          total: count,
          page,
          limit,
          totalPages
        }
      });
    } catch (error) {
      console.error('Error al obtener competiciones:', error);
      res.status(500).json({ error: 'Error al obtener competiciones' });
    }
  },

  // Obtener una competición por ID
  async getCompetitionById(req, res) {
    try {
      const { id } = req.params;
      const competition = await Competition.findByPk(id);

      if (!competition) {
        return res.status(404).json({ error: 'Competición no encontrada' });
      }

      res.json(competition);
    } catch (error) {
      console.error('Error al obtener la competición:', error);
      res.status(500).json({ error: 'Error al obtener la competición' });
    }
  },

  // Obtener equipos de una competición
  async getTeamsByCompetition(req, res) {
    try {
      const { id } = req.params;
      const competition = await Competition.findByPk(id, {
        include: [{ model: Team }]
      });

      if (!competition) {
        return res.status(404).json({ error: 'Competición no encontrada' });
      }

      res.json({
        competition: competition.name,
        teams: competition.Teams
      });
    } catch (error) {
      console.error('Error al obtener equipos:', error);
      res.status(500).json({ error: 'Error al obtener equipos de la competición' });
    }
  },

  // Obtener tabla de posiciones de una competición
  async getCompetitionStandings(req, res) {
    try {
      const { id } = req.params;
      const competition = await Competition.findByPk(id);

      if (!competition) return res.status(404).json({ error: 'Competición no encontrada' });

      const standings = await sequelize.query(`
        SELECT cs.*, t.name AS team_name, t.short_name AS team_short_name, t.logo_url AS team_logo
        FROM competition_standings cs
        LEFT JOIN teams t ON cs.team_id = t.id
        WHERE cs.competition_id = ?
        ORDER BY cs.position ASC
      `, {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      });

      return res.json({ competition, standings }); // <-- muy importante
    } catch (err) {
      console.error('Error al obtener tabla de posiciones:', err);
      res.status(500).json({ error: 'Error al obtener tabla de posiciones' });
    }
  },

  // Fetch and save scorers for a competition
  async fetchScorersForCompetition(req, res) {
    try {
      const { id } = req.params;
      const { season } = req.query; // e.g., 2024

      if (!season) {
        return res.status(400).json({ error: 'Season parameter is required' });
      }

      const competition = await Competition.findByPk(id);
      if (!competition) {
        return res.status(404).json({ error: 'Competición no encontrada' });
      }

      // Run the fetch in background
      fetchScorers(id, season);

      res.json({ message: `Fetching scorers for competition ${competition.name} in season ${season}` });
    } catch (error) {
      console.error('Error triggering scorers fetch:', error);
      res.status(500).json({ error: 'Error al iniciar la obtención de goleadores' });
    }
  },

  // Get top scorers for a competition
  async getTopScorers(req, res) {
    try {
      const { id } = req.params;
      const { season, limit = 10 } = req.query;

      const competition = await Competition.findByPk(id);
      if (!competition) {
        return res.status(404).json({ error: 'Competición no encontrada' });
      }

      let whereClause = { id_competition: id };
      if (season) {
        whereClause.season = season;
      }

      const scorers = await sequelize.query(`
        SELECT ps.*, p.first_name, p.last_name, p.display_name, p.photo_url, t.name AS team_name, t.logo_url AS team_logo
        FROM player_statistics ps
        LEFT JOIN players p ON ps.player_id = p.id
        LEFT JOIN teams t ON p.team_id = t.id
        WHERE ps.id_competition = ?
        ${season ? 'AND ps.season = ?' : ''}
        ORDER BY ps.goals DESC, ps.assists DESC
        LIMIT ?
      `, {
        replacements: season ? [id, season, parseInt(limit)] : [id, parseInt(limit)],
        type: sequelize.QueryTypes.SELECT
      });

      res.json({
        competition: competition.name,
        season: season || 'all',
        scorers
      });
    } catch (error) {
      console.error('Error al obtener máximos goleadores:', error);
      res.status(500).json({ error: 'Error al obtener máximos goleadores' });
    }
  },

  // Get matches for a competition with jornada filtering
  async getCompetitionMatches(req, res) {
    try {
      const { id } = req.params;
      const { jornada, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * parseInt(limit);

      const competition = await Competition.findByPk(id);
      if (!competition) {
        return res.status(404).json({ error: 'Competición no encontrada' });
      }

      let whereClause = { competition_id: id };
      if (jornada) {
        whereClause.matchday = parseInt(jornada);
      }

      const { count, rows: matches } = await sequelize.models.Match.findAndCountAll({
        where: {
          ...whereClause,
          home_team_id: { [sequelize.Sequelize.Op.ne]: null },
          away_team_id: { [sequelize.Sequelize.Op.ne]: null },
          status: { [sequelize.Sequelize.Op.ne]: 'scheduled' }
        },
        include: [
          { model: sequelize.models.Team, as: 'homeTeam', attributes: ['id', 'name', 'logo_url'] },
          { model: sequelize.models.Team, as: 'awayTeam', attributes: ['id', 'name', 'logo_url'] }
        ],
        order: [['match_date', 'ASC'], ['matchday', 'ASC']],
        limit: parseInt(limit),
        offset
      });

      // Get unique jornadas for filter dropdown
      const jornadas = await sequelize.models.Match.findAll({
        where: { competition_id: id },
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('matchday')), 'matchday']],
        order: [['matchday', 'ASC']],
        raw: true
      });

      const uniqueJornadas = jornadas
        .map(j => j.matchday)
        .filter(j => j !== null)
        .sort((a, b) => a - b);

      const totalPages = Math.ceil(count / limit);

      res.json({
        competition: competition.name,
        jornada: jornada || 'all',
        matches,
        jornadas: uniqueJornadas,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      });
    } catch (error) {
      console.error('Error al obtener partidos de la competición:', error);
      res.status(500).json({ error: 'Error al obtener partidos de la competición' });
    }
  },

  // Sync standings for a competition
  async syncCompetitionStandings(req, res) {
    try {
      const { id } = req.params;
      const competition = await Competition.findByPk(id);

      if (!competition) {
        return res.status(404).json({ error: 'Competición no encontrada' });
      }

      const { syncStandings } = require('../services/syncStandings');
      const updated = await syncStandings(competition.code);

      res.json({
        message: `Sincronizadas ${updated} posiciones para ${competition.name}`,
        updated
      });
    } catch (error) {
      console.error('Error sincronizando posiciones:', error);
      res.status(500).json({ error: 'Error al sincronizar posiciones' });
    }
  }
};
