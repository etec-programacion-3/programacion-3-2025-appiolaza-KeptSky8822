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
router.post('/:id/scorers', fetchScorersForCompetition);

module.exports = router;
                                                                                                    