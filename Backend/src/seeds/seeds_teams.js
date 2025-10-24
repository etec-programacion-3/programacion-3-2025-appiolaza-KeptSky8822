const sequelize = require('../config/database');
const Team = require('../models/equipo'); // Ajusta la ruta si tu modelo está en otra carpeta

// Lista de equipos de ejemplo
const teams = [
  {
    name: 'Real Madrid',
    short_name: 'RMA',
    code: 'RMA',
    founded: 1902,
    country: 'España',
    city: 'Madrid',
    stadium: 'Santiago Bernabéu',
    stadium_capacity: 81044,
    logo_url: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
    website: 'https://www.realmadrid.com/',
    description: 'Club de fútbol español, uno de los más exitosos del mundo.',
    colors: { primary: '#FFFFFF', secondary: '#000000' },
    market_value: 1000000000,
    external_id: 'RMA001',
    is_active: true,
    is_national_team: false
  },
  {
    name: 'FC Barcelona',
    short_name: 'FCB',
    code: 'FCB',
    founded: 1899,
    country: 'España',
    city: 'Barcelona',
    stadium: 'Camp Nou',
    stadium_capacity: 99354,
    logo_url: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
    website: 'https://www.fcbarcelona.com/',
    description: 'Club de fútbol español con gran historia y rivalidad con el Real Madrid.',
    colors: { primary: '#004D98', secondary: '#A50044' },
    market_value: 950000000,
    external_id: 'FCB001',
    is_active: true,
    is_national_team: false
  },
  {
    name: 'Boca Juniors',
    short_name: 'BOC',
    code: 'BOC',
    founded: 1905,
    country: 'Argentina',
    city: 'Buenos Aires',
    stadium: 'La Bombonera',
    stadium_capacity: 54000,
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Boca_Juniors_logo.svg',
    website: 'https://www.bocajuniors.com.ar/',
    description: 'Club argentino famoso por su historia y su hinchada apasionada.',
    colors: { primary: '#003399', secondary: '#FFD700' },
    market_value: 150000000,
    external_id: 'BOC001',
    is_active: true,
    is_national_team: false
  }
];

async function seedTeams() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');

    await sequelize.sync();
    console.log('📦 Modelos sincronizados.');

    // Limpiar datos existentes (opcional)
    await Team.destroy({ where: {} });
    console.log('🗑️ Datos anteriores eliminados.');

    // Insertar los equipos
    const createdTeams = await Team.bulkCreate(teams);
    console.log(`${createdTeams.length} equipos creados exitosamente:`);
    
    createdTeams.forEach(team => {
      console.log(`- ${team.name} (${team.country})`);
    });

    console.log('🎉 ¡Repoblación completada con éxito!');
  } catch (error) {
    console.error('❌ Error al repoblar la base de datos:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Conexión cerrada.');
  }
}

// Ejecutar el script
seedTeams();
