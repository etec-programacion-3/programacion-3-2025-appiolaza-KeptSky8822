const sequelize = require('../config/database');
const { Competition } = require('../models');

const competitions = [
  {
    name: 'UEFA Champions League',
    short_name: 'UCL',
    country: 'Europe',
    season: '2024-2025',
    type: 'tournament',
    start_date: '2024-09-17',
    end_date: '2025-05-31',
    logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/UEFA_Champions_League_logo_2.svg/300px-UEFA_Champions_League_logo_2.svg.png',
    description: 'La UEFA Champions League es la competición internacional de clubes más prestigiosa de Europa. Reúne a los mejores equipos del continente en una batalla por el título europeo.',
    status: 'ongoing',
    is_active: true
  },
  {
    name: 'LaLiga EA Sports',
    short_name: 'LaLiga',
    country: 'España',
    season: '2024-2025',
    type: 'league',
    start_date: '2024-08-15',
    end_date: '2025-05-25',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/LaLiga_EA_Sports_2023_Vertical_Logo.svg/300px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png',
    description: 'La Primera División de España, conocida como LaLiga, es la máxima categoría del fútbol profesional español. Es considerada una de las mejores ligas del mundo.',
    status: 'ongoing',
    is_active: true
  },
  {
    name: 'Liga Profesional de Fútbol',
    short_name: 'LPF',
    country: 'Argentina',
    season: '2024',
    type: 'league',
    start_date: '2024-01-26',
    end_date: '2024-12-15',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Liga_Profesional_de_F%C3%BAtbol_logo.svg/300px-Liga_Profesional_de_F%C3%BAtbol_logo.svg.png',
    description: 'La Liga Profesional de Fútbol es la máxima categoría del sistema de ligas del fútbol argentino. Es organizada por la Liga Profesional de Fútbol (LPF).',
    status: 'ongoing',
    is_active: true
  }
];

async function seedCompetitions() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Sincronizar el modelo (esto creará la tabla si no existe)
    await sequelize.sync();
    console.log('Modelo sincronizado.');

    // Limpiar datos existentes (opcional)
    await Competition.destroy({ where: {} });
    console.log('Datos anteriores eliminados.');

    // Insertar las competiciones
    const createdCompetitions = await Competition.bulkCreate(competitions);
    console.log(`${createdCompetitions.length} competiciones creadas exitosamente:`);
    
    createdCompetitions.forEach(comp => {
      console.log(`- ${comp.name} (${comp.country}) - ${comp.season}`);
    });

    console.log('\n¡Repoblación completada con éxito!');
  } catch (error) {
    console.error('Error al repoblar la base de datos:', error);
  } finally {
    // Cerrar la conexión
    await sequelize.close();
    console.log('Conexión cerrada.');
  }
}

// Ejecutar el script
seedCompetitions(); 