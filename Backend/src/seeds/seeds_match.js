const Match = require('../models/partido');
const Team = require('../models/equipo');
const Competition = require('../models/competicion');

async function seedMatches() {
  try {
    const competitions = await Competition.findAll({ attributes: ['id'] });
    const teams = await Team.findAll({ attributes: ['id'] });

    if (competitions.length < 1 || teams.length < 4) {
      console.error('⚠️ Necesitás al menos 1 competencia y 4 equipos.');
      return;
    }

    const matches = [
      {
        competition_id: competitions[0].id,
        home_team_id: teams[0].id,
        away_team_id: teams[1].id,
        match_date: '2025-03-01T19:00:00',
        matchday: 1,
        venue: 'Estadio Monumental',
        city: 'Buenos Aires',
        referee: 'Fernando Rapallini',
        home_score: 2,
        away_score: 1,
        home_possession: 55,
        away_possession: 45,
        status: 'finished'
      },
      {
        competition_id: competitions[0].id,
        home_team_id: teams[2].id,
        away_team_id: teams[3].id,
        match_date: '2025-03-02T17:00:00',
        matchday: 1,
        venue: 'La Bombonera',
        city: 'Buenos Aires',
        referee: 'Darío Herrera',
        home_score: 0,
        away_score: 0,
        home_possession: 50,
        away_possession: 50,
        status: 'finished'
      }
    ];

    await Match.bulkCreate(matches);
    console.log('✅ Seed de partidos insertado correctamente.');
  } catch (err) {
    console.error('❌ Error al insertar partidos:', err);
  }
}

seedMatches();
