const sequelize = require('./src/config/database');
const Article = require('./src/models/Articulo');
const MediaGallery = require('./src/models/MediaGallery');

async function syncDB() {
  try {
    await sequelize.sync({ force: true }); // Crea todas las tablas
    console.log('✅ Tablas sincronizadas correctamente');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error sincronizando tablas:', err);
    process.exit(1);
  }
}

syncDB();
