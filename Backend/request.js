// request.js
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/competitions';

async function testRoutes() {
  try {
    // 1️⃣ Obtener todas las competiciones
    const all = await axios.get(BASE_URL);
    console.log('✅ Todas las competiciones:');
    console.log(all.data);
    console.log('---------------------------');

    // 2️⃣ Obtener una competición por ID
    const one = await axios.get(`${BASE_URL}/1`);
    console.log('✅ Competición con ID 1:');
    console.log(one.data);
    console.log('---------------------------');

    // 3️⃣ Obtener equipos de una competición
    const teams = await axios.get(`${BASE_URL}/1/teams`);
    console.log('✅ Equipos de la competición 1:');
    console.log(teams.data);
    console.log('---------------------------');

    // 4️⃣ Crear una nueva competición (POST)
    const newCompetition = await axios.post(BASE_URL, {
      name: 'Copa Test',
      short_name: 'CT',
      country: 'Testland',
      season: '2025',
      type: 'tournament',
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      status: 'upcoming',
      is_active: true
    });
    console.log('✅ Competición creada:');
    console.log(newCompetition.data);
    console.log('---------------------------');

    // 5️⃣ Actualizar la competición recién creada (PUT)
    const updated = await axios.put(`${BASE_URL}/${newCompetition.data.id}`, {
      name: 'Copa Test Actualizada'
    });
    console.log('✅ Competición actualizada:');
    console.log(updated.data);
    console.log('---------------------------');

    // 6️⃣ Borrar la competición recién creada (DELETE)
    const deleted = await axios.delete(`${BASE_URL}/${newCompetition.data.id}`);
    console.log('✅ Competición borrada:');
    console.log(deleted.data);
    console.log('---------------------------');

  } catch (error) {
    console.error('❌ Error en la petición:', error.response?.data || error.message);
  }
}

// Ejecutar todas las pruebas
testRoutes();
