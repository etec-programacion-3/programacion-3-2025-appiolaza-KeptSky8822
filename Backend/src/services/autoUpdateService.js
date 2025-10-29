// backend/src/services/autoUpdateService.js
const cron = require('node-cron');
const { fetchCompetitions } = require('./fetchCompetitions');
const { fetchTeams } = require('./fetchTeams');
const { fetchMatches } = require('./fetchMatches');
const { syncStandings } = require('./syncStandings');
const { fetchPlayers } = require('./fetchPlayers');
const fetchScorers = require('./fetchScorers');

class AutoUpdateService {
  constructor() {
    this.isRunning = false;
    this.jobs = [];
  }

  // Sincronización completa de todas las competiciones
  async syncAllCompetitions() {
    if (this.isRunning) {
      console.log('🔄 Sincronización ya en curso, saltando...');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Iniciando sincronización automática completa...');

    try {
      // 1. Sincronizar competiciones
      console.log('📊 Sincronizando competiciones...');
      await fetchCompetitions();

      // 2. Sincronizar equipos de las 4 competiciones principales
      const competitions = [
        { code: 'CL', name: 'UEFA Champions League', season: 2025 },
        { code: 'PD', name: 'La Liga', season: 2025 },
        { code: 'CLI', name: 'CONMEBOL Libertadores', season: 2025 },
        { code: 'PL', name: 'Premier League', season: 2025 }
      ];

      for (const comp of competitions) {
        console.log(`👥 Sincronizando equipos de ${comp.name}...`);
        await fetchTeams(comp.code, comp.season);
      }

      // 3. Sincronizar partidos
      for (const comp of competitions) {
        console.log(`⚽ Sincronizando partidos de ${comp.name}...`);
        await fetchMatches(comp.code, comp.season);
      }

      // 4. Sincronizar posiciones (solo Champions League por ahora)
      console.log('🏆 Sincronizando posiciones de Champions League...');
      await syncStandings('CL');

      // 5. Sincronizar jugadores de equipos de Champions League
      console.log('👥 Sincronizando jugadores de Champions League...');
      await fetchPlayers('CL', 2025);

      // 6. Sincronizar goleadores de Champions League
      console.log('⚽ Sincronizando goleadores de Champions League...');
      await fetchScorers(2001, '2024'); // Competition ID 2001 for Champions League

      console.log('✅ Sincronización automática completada exitosamente!');
    } catch (error) {
      console.error('❌ Error en sincronización automática:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  // Sincronización rápida (posiciones, partidos y goleadores recientes)
  async quickSync() {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('⚡ Iniciando sincronización rápida...');

    try {
      // Sincronizar posiciones de Champions League
      await syncStandings('CL');

      // Sincronizar partidos de todas las competiciones principales
      const competitions = [
        { code: 'CL', name: 'UEFA Champions League', season: 2025 },
        { code: 'PD', name: 'La Liga', season: 2025 },
        { code: 'CLI', name: 'CONMEBOL Libertadores', season: 2025 },
        { code: 'PL', name: 'Premier League', season: 2025 }
      ];

      for (const comp of competitions) {
        console.log(`⚽ Sincronizando partidos de ${comp.name}...`);
        await fetchMatches(comp.code, comp.season);
      }

      // Sincronizar goleadores de Champions League
      console.log('🎯 Sincronizando goleadores de Champions League...');
      await fetchScorers(2001, '2024');

      console.log('✅ Sincronización rápida completada!');
    } catch (error) {
      console.error('❌ Error en sincronización rápida:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  // Iniciar programador automático
  startScheduler() {
    console.log('⏰ Iniciando programador automático de actualizaciones...');

    // Sincronización completa cada 6 horas (a las 2:00, 8:00, 14:00, 20:00)
    const fullSyncJob = cron.schedule('0 2,8,14,20 * * *', () => {
      console.log('🕐 Ejecutando sincronización completa programada...');
      this.syncAllCompetitions();
    });

    // Sincronización rápida cada 30 minutos
    const quickSyncJob = cron.schedule('*/30 * * * *', () => {
      console.log('🕐 Ejecutando sincronización rápida programada...');
      this.quickSync();
    });

    this.jobs = [fullSyncJob, quickSyncJob];

    console.log('✅ Programador automático iniciado!');
    console.log('📅 Sincronización completa: cada 6 horas');
    console.log('⚡ Sincronización rápida: cada 30 minutos');
  }

  // Detener programador
  stopScheduler() {
    console.log('🛑 Deteniendo programador automático...');
    this.jobs.forEach(job => job.destroy());
    this.jobs = [];
    console.log('✅ Programador detenido!');
  }

  // Ejecutar sincronización manual
  async manualSync() {
    console.log('🔧 Ejecutando sincronización manual...');
    await this.syncAllCompetitions();
  }

  // Obtener estado del servicio
  getStatus() {
    return {
      isRunning: this.isRunning,
      schedulerActive: this.jobs.length > 0,
      nextFullSync: this.jobs[0]?.nextDates()?.[0]?.toISOString(),
      nextQuickSync: this.jobs[1]?.nextDates()?.[0]?.toISOString()
    };
  }
}

// Instancia singleton
const autoUpdateService = new AutoUpdateService();

module.exports = autoUpdateService;