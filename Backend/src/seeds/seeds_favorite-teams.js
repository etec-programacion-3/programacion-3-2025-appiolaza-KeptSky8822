const sequelize = require('../config/database');
const FavoriteTeam = require('../models/equipos_favoritos_usuarios');
const User = require('../models/usuario');
const Team = require('../models/equipo');

async function seedFavoriteTeams() {
  try {
    await sequelize.sync();

    const users = await User.findAll();
    const teams = await Team.findAll();

    if (users.length < 3 || teams.length < 3) {
      console.log('⚠️ Se necesitan al menos 3 usuarios y 3 equipos antes de correr esta seed.');
      return;
    }

    const favoritesData = [
      // Usuario 1
      { user_id: users[0].id, team_id: teams[0].id },
      { user_id: users[0].id, team_id: teams[1].id },

      // Usuario 2
      { user_id: users[1].id, team_id: teams[1].id },
      { user_id: users[1].id, team_id: teams[2].id },

      // Usuario 3
      { user_id: users[2].id, team_id: teams[0].id },
      { user_id: users[2].id, team_id: teams[2].id }
    ];

    await FavoriteTeam.bulkCreate(favoritesData);
    console.log('✅ Seed de equipos favoritos creada correctamente');
  } catch (error) {
    console.error('❌ Error al crear seed de equipos favoritos:', error);
  } finally {
    await sequelize.close();
  }
}

seedFavoriteTeams();
