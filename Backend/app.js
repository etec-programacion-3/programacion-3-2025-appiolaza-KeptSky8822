// app.js
const express = require("express");
const cors = require('cors');
const { sequelize } = require("./src/models");
const competicion_Routes = require("./src/routes/competicion_routes");
const equipo_Routes = require('./src/routes/equipo_routes');
const jugadores_Routes = require('./src/routes/jugadores_routes');
const partido_Routes = require('./src/routes/partido_routes');
const partidoevent_Routes = require('./src/routes/partidoevent_routes');
const usuario_Routes = require('./src/routes/usuario_routes');
const auth_Routes = require('./src/routes/auth.routes');
const equipofav_Routes = require('./src/routes/equipos_favoritos_usuarios');
const favoritePlayersRoutes = require('./src/routes/jugadores_favoritos_usuarios');
const ArticleRoutes = require('./src/routes/articulos');
const MediaGalleryRoutes = require('./src/routes/mediagallery');
const autoUpdateService = require('./src/services/autoUpdateService');

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;


require('dotenv').config();

// Leer variable del .env
const BACKEND_URL = process.env.BACKEND_URL;

console.log("URL del backend:", BACKEND_URL);



const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL // 👈 el puerto donde corre Vite
}));

app.use(express.json());


// Usa las rutas de competiciones
app.use("/api/competitions", competicion_Routes);
// Usa las rutas de equipos
app.use('/api/teams', equipo_Routes);
//Usa las rutas  de jugadores
app.use('/api/players', jugadores_Routes);
// Usas las rutas de partidos
app.use('/api/matches', partido_Routes);
// Usas las rutas de partidos de evento
app.use('/api/match-events',partidoevent_Routes );
// Usas las rutas de usuarios
app.use('/api/auth', auth_Routes);
app.use('/api/users', usuario_Routes);  
app.use('/api/favorite', equipofav_Routes);
app.use('/api/favorite-players', favoritePlayersRoutes);
app.use('/api/articles', ArticleRoutes);
app.use('/api/media', MediaGalleryRoutes);



// Rutas de ejemplo
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// Rutas de administración del servicio automático
app.get("/api/admin/auto-update/status", (req, res) => {
  const status = autoUpdateService.getStatus();
  res.json({
    message: "Estado del servicio de actualización automática",
    ...status
  });
});

app.post("/api/admin/auto-update/manual", async (req, res) => {
  try {
    await autoUpdateService.manualSync();
    res.json({ message: "Sincronización manual completada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error en sincronización manual", details: error.message });
  }
});

app.post("/api/admin/auto-update/start", (req, res) => {
  autoUpdateService.startScheduler();
  res.json({ message: "Programador automático iniciado" });
});

app.post("/api/admin/auto-update/stop", (req, res) => {
  autoUpdateService.stopScheduler();
  res.json({ message: "Programador automático detenido" });
});

async function main() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    await sequelize.sync({}); // crea/actualiza las tablas
    console.log("✅ Modelos sincronizados");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);


      // Iniciar servicio de actualización automática
      autoUpdateService.startScheduler();
      console.log("🔄 Servicio de actualización automática iniciado");
    });
  } catch (error) {
    console.error("❌ Error al iniciar:", error);
  }
}

main();
