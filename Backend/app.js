const express = require('express');
const app = express();

const db = require('./src/models'); // importa index.js dentro de models

db.sequelize.sync({ alter: true }) // en desarrollo
  .then(() => console.log("✅ Base de datos sincronizada (SQLite)"))
  .catch(err => console.error("❌ Error al sincronizar DB:", err));
app.use(express.json());

// Rutas
// app.use('/api/usuarios', require('./src/routes/usuarioRoutes'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
})