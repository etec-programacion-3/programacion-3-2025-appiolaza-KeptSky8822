const sequelize = require('../config/database');
const Match = require('../models/partido');
const Team = require('../models/equipo');
const Competition = require('../models/competicion');
const MatchEvent = require('../models/partidoevent');

async function seed() {
  try {
    // --- Obtener dos equipos existentes ---
    const teams = await Team.findAll({ limit: 2 });
    if (teams.length < 2) throw new Error('Se necesitan al menos 2 equipos en la base de datos');

    const teamA = teams[0];
    const teamB = teams[1];

    // --- Obtener una competición existente ---
    const competition = await Competition.findOne();
    if (!competition) throw new Error('No hay competiciones en la base de datos');

    // --- Crear un partido ---
    const match = await Match.create({
      match_date: new Date(),       // <- Campo correcto
      home_team_id: teamA.id,
      away_team_id: teamB.id,
      home_score: 0,
      away_score: 0,
      status: 'scheduled',
      competition_id: competition.id
    });

    // --- Crear un evento del partido ---
    await MatchEvent.create({
      match_id: match.id,
      team_id: teamA.id,
      minute: 10,
      event_type: 'GOAL',
      description: 'Gol inicial del equipo A'
    });

    console.log('Seed completado: partido y evento creados usando equipos y competición existentes');
    process.exit(0);
  } catch (error) {
    console.error('Error en el seed:', error);
    process.exit(1);
  }
}

seed();
