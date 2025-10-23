// app.js
const express = require("express");
const { sequelize } = require("./src/models");
const competicion_Routes = require("./src/routes/competicion_routes");
const equipo_Routes = require('./src/routes/equipo_routes');
const jugadores_Routes = require('./src/routes/jugadores_routes');
const partido_Routes = require('./src/routes/partido_routes');
const partidoevent_Routes = require('./src/routes/partidoevent_routes');
const usuario_Routes = require('./src/routes/usuario_routes');

const app = express();
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
app.use('/api/users', usuario_Routes);  

// Rutas de ejemplo
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

async function main() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    await sequelize.sync({  }); // crea/actualiza las tablas
    console.log("✅ Modelos sincronizados");

    app.listen(3000, () => {
      console.log("Servidor corriendo en http://localhost:3000");
    });
  } catch (error) {
    console.error("❌ Error al iniciar:", error);
  }
}

main();
