const PlayerStatistics = require('../models/jugadores_estadistica');
const Player = require('../models/jugador');
const { Competition } = require('../models');
const sequelize = require('../config/database');

const seedPlayerStatistics = async () => {
  try {
    await sequelize.sync();

    const players = await Player.findAll({
      attributes: ['id', 'first_name', 'last_name']
    });

    const competitions = await Competition.findAll({
      attributes: ['id']
    });

    if (!players.length) {
      console.log('⚠️ No hay jugadores en la base de datos. Ejecutá primero el seed de jugadores.');
      return;
    }

    if (!competitions.length) {
      console.log('⚠️ No hay competiciones en la base de datos. Ejecutá primero el seed de competiciones.');
      return;
    }

    const stats = players.map(player => {
      const games = Math.floor(Math.random() * 38) + 1;
      const goals = Math.floor(Math.random() * 20);
      const assists = Math.floor(Math.random() * 10);
      const yellow = Math.floor(Math.random() * 6);
      const red = Math.floor(Math.random() * 2);
      const minutes = games * (Math.floor(Math.random() * 30) + 60);
      const randomCompetition = competitions[Math.floor(Math.random() * competitions.length)];

      console.log(`Generando stats para ${player.first_name} ${player.last_name} en competición ${randomCompetition.id}`);

      return {
        player_id: player.id,
        id_competition: randomCompetition.id,
        season: '2024-25',
        games_played: games,
        goals,
        assists,
        yellow_cards: yellow,
        red_cards: red,
        minutes_played: minutes
      };
    });

    await PlayerStatistics.bulkCreate(stats, { ignoreDuplicates: true });

    console.log('✅ Seed de estadísticas de jugadores completado correctamente.');
  } catch (error) {
    console.error('❌ Error al insertar estadísticas de jugadores:', error);
  } finally {
    await sequelize.close();
  }
};

seedPlayerStatistics();
