import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './LaLiga.css';

const LaLiga = () => {
  const [standings, setStandings] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [jornadas, setJornadas] = useState([]);
  const [selectedJornada, setSelectedJornada] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingScorers, setLoadingScorers] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [error, setError] = useState(null);
  const [scorersError, setScorersError] = useState(null);
  const [matchesError, setMatchesError] = useState(null);
  const [activeTab, setActiveTab] = useState('standings');

  // ---------- STANDINGS ----------
  const fetchLaLigaStandings = async () => {
    try {
      setLoading(true);
      const competitions = await apiService.getCompetitions();
      const laLiga = competitions.data?.find(
        comp =>
          comp.name.toLowerCase().includes('la liga') ||
          comp.name.toLowerCase().includes('primera division') ||
          comp.short_name.toLowerCase().includes('PD') 
      );

      if (!laLiga) {
        setError('No se encontró la competición La Liga');
        setLoading(false);
        return;
      }

      const standingsData = await apiService.getCompetitionStandings(laLiga.id);

      if (standingsData.standings && standingsData.standings.length > 0) {
        const formattedStandings = standingsData.standings.map(team => ({
          position: team.position,
          team: team.team_name,
          played: team.played_games,
          won: team.won,
          drawn: team.draw,
          lost: team.lost,
          goalsFor: team.goals_for,
          goalsAgainst: team.goals_against,
          goalDifference: team.goal_difference,
          points: team.points,
          logo: team.team_logo,
        }));
        setStandings(formattedStandings);
      } else {
        setError('No hay datos de standings disponibles');
      }
    } catch (err) {
      setError('Error al cargar la tabla de posiciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- TOP SCORERS ----------
  const fetchTopScorers = async () => {
    try {
      setLoadingScorers(true);
      const competitions = await apiService.getCompetitions();
      const laLiga = competitions.data?.find(
        comp =>
          comp.name.toLowerCase().includes('la liga') ||
          comp.name.toLowerCase().includes('primera division') ||
          comp.short_name.toLowerCase().includes('PD')
      );

      if (!laLiga) {
        setScorersError('No se encontró la competición La Liga');
        setLoadingScorers(false);
        return;
      }

      const scorersData = await apiService.getTopScorers(laLiga.id, null, 10);
      if (scorersData.scorers && scorersData.scorers.length > 0) {
        setTopScorers(scorersData.scorers);
      } else {
        setScorersError('No hay datos de goleadores disponibles');
      }
    } catch (err) {
      setScorersError('Error al cargar los máximos goleadores');
      console.error(err);
    } finally {
      setLoadingScorers(false);
    }
  };

  // ---------- MATCHES ----------
  const fetchMatches = async (jornada = '') => {
    try {
      setLoadingMatches(true);
      setMatchesError(null); // Limpiar errores previos

      const competitions = await apiService.getCompetitions();
      const laLiga = competitions.data?.find(comp =>
        comp.name.toLowerCase().includes('la liga') ||
        comp.name.toLowerCase().includes('primera division') ||
        comp.code === 'PD'
      );

      if (!laLiga) {
        setMatchesError('No se encontró la competición La Liga');
        setLoadingMatches(false);
        return;
      }

      console.log('Obteniendo partidos para la jornada:', jornada); // Debug log
      const matchesData = await apiService.getCompetitionMatches(laLiga.id, jornada);
      console.log('Datos de partidos recibidos:', matchesData); // Debug log

      if (matchesData.matches) {
        setMatches(matchesData.matches);

        if (matchesData.jornadas && jornada === '') {
          // Solo actualizar jornadas cuando no hay filtro específico
          setJornadas(matchesData.jornadas);
        }
      } else {
        // Si no hay datos, usar datos de ejemplo
        if (matches.length === 0) {
          setMatchesError('No hay datos de partidos disponibles. Usando datos de ejemplo.');
          setMatches([
            {
              id: 1,
              match_date: '2024-11-05T17:00:00Z',
              homeTeam: { name: 'Real Madrid', logo_url: '' },
              awayTeam: { name: 'Barcelona', logo_url: '' },
              home_score: 2,
              away_score: 1,
              status: 'finished',
              matchday: 12
            },
            {
              id: 2,
              match_date: '2024-11-05T19:30:00Z',
              homeTeam: { name: 'Atlético de Madrid', logo_url: '' },
              awayTeam: { name: 'Real Betis', logo_url: '' },
              home_score: 3,
              away_score: 2,
              status: 'finished',
              matchday: 12
            }
          ]);
        }
      }

    } catch (err) {
      setMatchesError('Error al cargar los partidos');
      console.error('Error al obtener los partidos:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleJornadaChange = async (jornada) => {
    setSelectedJornada(jornada);
    await fetchMatches(jornada);
  };


  useEffect(() => {
    fetchLaLigaStandings();
    fetchTopScorers();
    fetchMatches();
  }, []);

  // ---------- RENDER ----------
  return (
    <div className="laliga-page">
      <div className="laliga-hero">
        <div className="laliga-logo-large">
          ⚽
        </div>
        <h1>La Liga</h1>
        <p>La máxima competición del fútbol español</p>
      </div>

      <div className="laliga-content">
        <div className="laliga-stats">
          <div className="stat-card">
            <h3>20</h3>
            <p>Equipos</p>
          </div>
          <div className="stat-card">
            <h3>España</h3>
            <p>País</p>
          </div>
          <div className="stat-card">
            <h3>2025-26</h3>
            <p>Temporada</p>
          </div>
        </div>

      <div className="competition-tabs">
        <button
          className={`tab-button ${activeTab === 'standings' ? 'active' : ''}`}
          onClick={() => setActiveTab('standings')}
        >
          Tabla de Posiciones
        </button>
        <button
          className={`tab-button ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          Resultados
        </button>
        <button
          className={`tab-button ${activeTab === 'scorers' ? 'active' : ''}`}
          onClick={() => setActiveTab('scorers')}
        >
        

          Máximos Goleadores
        </button>
      </div>
        {activeTab === 'matches' && (
          <div className="matches-section">
            <div className="matches-section">
            <h2>Resultados de Partidos</h2>

            <div className="matches-filter">
              <button
                className="nav-button"
                onClick={() => {
                  const currentIndex = jornadas.indexOf(parseInt(selectedJornada) || jornadas[0]);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : jornadas.length - 1;
                  handleJornadaChange(jornadas[prevIndex]);
                }}
                disabled={jornadas.length === 0}
              >
                ‹
              </button>

              <div className="current-jornada">
                {selectedJornada ? `Jornada ${selectedJornada}` : 'Selecciona Jornada'}
              </div>

              <button
                className="nav-button"
                onClick={() => {
                  const currentIndex = jornadas.indexOf(parseInt(selectedJornada) || jornadas[0]);
                  const nextIndex = currentIndex < jornadas.length - 1 ? currentIndex + 1 : 0;
                  handleJornadaChange(jornadas[nextIndex]);
                }}
                disabled={jornadas.length === 0}
              >
                ›
              </button>
            </div>

            {loadingMatches ? (
              <div className="loading">
                <p>Cargando partidos...</p>
              </div>
            ) : matchesError ? (
              <div className="error">
                <p>{matchesError}</p>
              </div>
            ) : (
              <div className="matches-list">
                {matches.map((match) => (
                  <div key={match.id} className="match-card">
                    <div className="match-header">
                      <span className="match-date">
                        {new Date(match.match_date).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {match.matchday && (
                        <span className="match-jornada">Jornada {match.matchday}</span>
                      )}
                    </div>
                    <div className="match-teams">
                      <div className="team home-team">
                        <div className="team-info">
                          {match.homeTeam?.logo_url && (
                            <img src={match.homeTeam.logo_url} alt={match.homeTeam.name} className="team-logo-match" />
                          )}
                          <span className="team-name">{match.homeTeam?.name}</span>
                        </div>
                        <span className="team-score">{match.home_score ?? '-'}</span>
                      </div>

                      <div className="vs-separator">vs</div>

                      <div className="team away-team">
                        <span className="team-score">{match.away_score ?? '-'}</span>
                        <div className="team-info">
                          <span className="team-name">{match.awayTeam?.name}</span>
                          {match.awayTeam?.logo_url && (
                            <img src={match.awayTeam.logo_url} alt={match.awayTeam.name} className="team-logo-match" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="match-status">
                      <span className={`status-badge ${match.status}`}>
                        {match.status === 'finished' ? 'Finalizado' :
                        match.status === 'live' ? 'En Vivo' :
                        match.status === 'scheduled' ? 'Programado' : match.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          </div>
        )}

      

        {activeTab === 'standings' && (
          <div className="standings-section">
            <h2>Tabla de Posiciones - Temporada 2025-26</h2>
          {loading ? (
            <div className="loading">
              <p>Cargando tabla de posiciones...</p>
            </div>
          ) : error ? (
            <div className="error">
              <p>{error}</p>
            </div>
            ) : (
              <div className="standings-table-container">
                <table className="standings-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Equipo</th>
                      <th>PJ</th>
                      <th>G</th>
                      <th>E</th>
                      <th>P</th>
                      <th>GF</th>
                      <th>GC</th>
                      <th>DG</th>
                      <th>Pts</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map(team => {
                      let rowClass = '';
                      let statusClass = '';
                      let statusText = '';

                      if (team.position >= 1 && team.position <= 4) {
                        rowClass = 'position-champions-league';
                        statusClass = 'champions-league';
                        statusText = 'Champions';
                      } else if (team.position === 5) {
                        rowClass = 'position-europa-league';
                        statusClass = 'europa-league';
                        statusText = 'Europa League';
                      } else if (team.position === 6) {
                        rowClass = 'position-conference-league';
                        statusClass = 'conference-league';
                        statusText = 'Conference';
                      } else if (team.position >= 18) {
                        rowClass = 'position-relegation';
                        statusClass = 'relegation';
                        statusText = 'Descenso';
                      }

                      return (
                        <tr key={team.position} className={rowClass}>
                          <td className="position">{team.position}</td>
                          <td className="team-name">
                            <div className="team-info">
                              {team.logo && (
                                <img src={team.logo} alt={team.team} className="team-logo-small" />
                              )}
                              <span>{team.team}</span>
                            </div>
                          </td>
                          <td>{team.played}</td>
                          <td>{team.won}</td>
                          <td>{team.drawn}</td>
                          <td>{team.lost}</td>
                          <td>{team.goalsFor}</td>
                          <td>{team.goalsAgainst}</td>
                          <td
                            className={
                              team.goalDifference > 0
                                ? 'positive'
                                : team.goalDifference < 0
                                ? 'negative'
                                : ''
                            }
                          >
                            {team.goalDifference > 0 ? '+' : ''}
                            {team.goalDifference}
                          </td>
                          <td className="points">{team.points}</td>
                          <td className="status-cell">
                            {statusText ? (
                              <span className={`status-badge ${statusClass}`}>
                                {statusText}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="standings-legend">
                  <div className="legend-item">
                    <span className="legend-color champions-league"></span>
                    <span>UEFA Champions League</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color europa-league"></span>
                    <span>UEFA Europa League</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color conference-league"></span>
                    <span>UEFA Conference League</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color relegation"></span>
                    <span>Descenso a Segunda División</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="laliga-info">
          <h2>Sobre La Liga</h2>
          <p>
            La Liga es la máxima categoría del sistema de ligas de España y una de las competiciones
            más prestigiosas del fútbol mundial.
          </p>
          <p>
            Desde su fundación en 1929, ha sido el escenario de los mejores jugadores y equipos
            del fútbol español, con clubes legendarios como el Real Madrid y el FC Barcelona.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LaLiga;
