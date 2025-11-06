// src/routes/competitionRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllCompetitions,
  getCompetitionById,
  getTeamsByCompetition,
  fetchScorersForCompetition
}= require('../controllers/competitionController');

// Rutas
router.get("/", getAllCompetitions);
router.get("/:id", getCompetitionById);
router.get('/:id/teams', getTeamsByCompetition);
router.get('/:id/standings', require('../controllers/competitionController').getCompetitionStandings);
router.get('/:id/scorers', require('../controllers/competitionController').getTopScorers);
router.get('/:id/matches', require('../controllers/competitionController').getCompetitionMatches);
router.post('/:id/scorers', fetchScorersForCompetition);

module.exports = router;
                                                                                                    