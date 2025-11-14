// backend/src/services/autoUpdateService.js
const cron = require('node-cron');
const { fetchCompetitions } = require('./fetchCompetitions');
const { fetchTeams } = require('./fetchTeams');
const { fetchMatches } = require('./fetchMatches');
const { syncStandings } = require('./syncStandings');
const { fetchPlayers } = require('./fetchPlayers');
const fetchScorers = require('./fetchScorers');
const sequelize = require('../config/database'); // 👈 Asegurate de tener esto

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

      // 2. Sincronizar equipos de las 6 competiciones principales
      const competitions = [
        { code: 'CL', name: 'UEFA Champions League', season: 2025 },
        { code: 'PD', name: 'La Liga', season: 2025 },
        { code: 'PL', name: 'Premier League', season: 2025 },
        { code: 'BL1', name: 'Bundesliga', season: 2025 },
        { code: 'SA', name: 'Serie A', season: 2025 },
        { code: 'FL1', name: 'Ligue 1', season: 2025 }
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

      // 4. Sincronizar posiciones de todas las ligas principales
      for (const comp of competitions) {
        console.log(`🏆 Sincronizando posiciones de ${comp.name}...`);
        await syncStandings(comp.code);
      }

      // 5. Sincronizar jugadores de Champions League
      console.log('👥 Sincronizando jugadores de Champions League...');
      await fetchPlayers(comp.code, comp.season);

      // 6. Sincronizar goleadores de Champions League
      console.log('⚽ Sincronizando goleadores de Todas las competencias...');
      await fetchScorers(comp.code, comp.season); // Competition ID 2001 for Champions League

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
      // Dropear y recrear la tabla competition_standings
      console.log('🗑️ Eliminando tabla competition_standings...');
      await sequelize.query('DROP TABLE IF EXISTS competition_standings');
      const CompetitionStanding = require('../models/CompetitionStanding');
      await CompetitionStanding.sync();
      console.log('✅ Tabla competition_standings recreada.');

      // Sincronizar posiciones de todas las ligas principales
      const competitions = [
        { code: 'CL', name: 'UEFA Champions League', season: 2025 },
        { code: 'PD', name: 'La Liga', season: 2025 },
        { code: 'PL', name: 'Premier League', season: 2025 },
        { code: 'BL1', name: 'Bundesliga', season: 2025 },
        { code: 'SA', name: 'Serie A', season: 2025 },
        { code: 'FL1', name: 'Ligue 1', season: 2025 }
      ];

      for (const comp of competitions) {
        console.log(`🏆 Sincronizando posiciones de ${comp.name}...`);
        await syncStandings(comp.code);
      }

      // Sincronizar partidos de todas las competiciones principales
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

  // 🔁 Sincronización completa una vez por día (00:00)
  const fullSyncJob = cron.schedule('0 0 * * *', () => {
    console.log('🕐 Ejecutando sincronización completa diaria...');
    this.syncAllCompetitions();
  });

  // ⚡ Sincronización rápida una vez por día (06:00)
  const quickSyncJob = cron.schedule('0 6 * * *', () => {
    console.log('⚡ Ejecutando sincronización rápida diaria...');
    this.quickSync();
  });

  this.jobs = [fullSyncJob, quickSyncJob];

  console.log('✅ Programador automático iniciado!');
  console.log('📅 Sincronización completa: 1 vez por día (00:00)');
  console.log('⚡ Sincronización rápida: 1 vez por día (06:00)');
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
