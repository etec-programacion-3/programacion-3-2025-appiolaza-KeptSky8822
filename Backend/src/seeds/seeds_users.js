const sequelize = require('../config/database');
const User = require('../models/usuario');

async function seed() {
  try {
    // --- Crear usuarios de ejemplo ---
    const users = [
      { username: 'julian', email: 'julian@example.com', password: '123456' },
      { username: 'ana', email: 'ana@example.com', password: '123456' },
      { username: 'pedro', email: 'pedro@example.com', password: '123456' }
    ];

    for (const userData of users) {
      await User.create(userData);
    }

    console.log('Seed de usuarios completado.');
    process.exit(0);
  } catch (error) {
    console.error('Error en el seed:', error);
    process.exit(1);
  }
}

seed();
