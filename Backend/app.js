// app.js
const express = require("express");
const { sequelize } = require("./src/models");
const competicion_Routes = require("./src/routes/competitions.routes");

const app = express();
app.use(express.json());

// Usa las rutas de competiciones
app.use("/api/competitions", competicion_Routes);

// Rutas de ejemplo
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

async function main() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    await sequelize.sync({ alter: true }); // crea/actualiza las tablas
    console.log("✅ Modelos sincronizados");

    app.listen(3000, () => {
      console.log("Servidor corriendo en http://localhost:3000");
    });
  } catch (error) {
    console.error("❌ Error al iniciar:", error);
  }
}

main();
