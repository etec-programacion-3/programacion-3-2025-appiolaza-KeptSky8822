const apiClient = require('./apiFootballService');

async function testConnection() {
  try {
    const response = await apiClient.get('/competitions');
    console.log('✅ Conexión exitosa a Football API');
    console.log('Número de competiciones:', response.data.count || response.data.competitions.length);
  } catch (error) {
    console.error('❌ Error al conectar con Football API');
    console.error(error.response?.status, error.response?.data || error.message);
  }
}

testConnection();
