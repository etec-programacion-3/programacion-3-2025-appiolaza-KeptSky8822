import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './Champions.css';

const Champions = () => {
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

  const fetchMatches = async (jornada = '') => {
    try {
      setLoadingMatches(true);
      setMatchesError(null); // Limpiar errores previos

      const competitions = await apiService.getCompetitions();
      const championsLeague = competitions.data?.find(comp =>
        comp.name.toLowerCase().includes('champions') ||
        comp.name.toLowerCase().includes('uefa')
      );

      if (!championsLeague) {
        setMatchesError('No se encontró la competición Champions League');
        setLoadingMatches(false);
        return;
      }

      console.log('Fetching matches for jornada:', jornada); // Debug log
      const matchesData = await apiService.getCompetitionMatches(championsLeague.id, jornada);
      console.log('Matches data received:', matchesData); // Debug log

      if (matchesData.matches) {
        setMatches(matchesData.matches);
        if (matchesData.jornadas && jornada === '') {
          // Solo actualizar jornadas cuando no hay filtro específico
          setJornadas(matchesData.jornadas);
        }
      } else {
        // Mantener los datos actuales si existen, solo actualizar si no hay datos
        if (matches.length === 0) {
          setMatchesError('No hay datos de partidos disponibles. Usando datos de ejemplo.');
          setMatches([
            {
              id: 1,
              match_date: '2024-11-05T20:00:00Z',
              homeTeam: { name: 'Real Madrid', logo_url: '' },
              awayTeam: { name: 'Manchester City', logo_url: '' },
              home_score: 2,
              away_score: 1,
              status: 'finished',
              matchday: 4
            },
            {
              id: 2,
              match_date: '2024-11-05T20:00:00Z',
              homeTeam: { name: 'Bayern Munich', logo_url: '' },
              awayTeam: { name: 'Paris Saint-Germain', logo_url: '' },
              home_score: 3,
              away_score: 3,
              status: 'finished',
              matchday: 4
            }
          ]);
        }
      }

    } catch (err) {
      setMatchesError('Error al cargar los partidos');
      console.error('Error fetching matches:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleJornadaChange = async (jornada) => {
    setSelectedJornada(jornada);
    await fetchMatches(jornada);
  };

  useEffect(() => {
  const fetchChampionsStandings = async () => {
    try {
      setLoading(true);

      const competitions = await apiService.getCompetitions();
      const championsLeague = competitions.data?.find(comp =>
        comp.name.toLowerCase().includes('champions') ||
        comp.name.toLowerCase().includes('uefa')
      );

      if (!championsLeague) {
        setError('No se encontró la competición Champions League');
        setLoading(false);
        return;
      }

      const standingsData = await apiService.getCompetitionStandings(championsLeague.id);

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
          logo: team.team_logo
        }));

        setStandings(formattedStandings);
      } else {
        // Mantener los datos actuales si existen, solo actualizar si no hay datos
        if (standings.length === 0) {
          setStandings([
            { position: 1, team: 'Real Madrid', points: 15, played: 6, won: 5, drawn: 0, lost: 1, goalsFor: 18, goalsAgainst: 8, goalDifference: 10 },
            { position: 2, team: 'Bayern Munich', points: 13, played: 6, won: 4, drawn: 1, lost: 1, goalsFor: 16, goalsAgainst: 7, goalDifference: 9 },
            { position: 3, team: 'Manchester City', points: 12, played: 6, won: 4, drawn: 0, lost: 2, goalsFor: 14, goalsAgainst: 9, goalDifference: 5 },
            { position: 4, team: 'Paris Saint-Germain', points: 10, played: 6, won: 3, drawn: 1, lost: 2, goalsFor: 12, goalsAgainst: 10, goalDifference: 2 },
            { position: 5, team: 'Barcelona', points: 9, played: 6, won: 3, drawn: 0, lost: 3, goalsFor: 11, goalsAgainst: 12, goalDifference: -1 },
            { position: 6, team: 'Liverpool', points: 8, played: 6, won: 2, drawn: 2, lost: 2, goalsFor: 10, goalsAgainst: 11, goalDifference: -1 },
            { position: 7, team: 'Inter Milan', points: 7, played: 6, won: 2, drawn: 1, lost: 3, goalsFor: 9, goalsAgainst: 13, goalDifference: -4 },
            { position: 8, team: 'Borussia Dortmund', points: 6, played: 6, won: 2, drawn: 0, lost: 4, goalsFor: 8, goalsAgainst: 14, goalDifference: -6 },
            { position: 9, team: 'Juventus', points: 5, played: 6, won: 1, drawn: 2, lost: 3, goalsFor: 7, goalsAgainst: 15, goalDifference: -8 },
            { position: 10, team: 'Atlético Madrid', points: 4, played: 6, won: 1, drawn: 1, lost: 4, goalsFor: 6, goalsAgainst: 16, goalDifference: -10 },
            { position: 11, team: 'Chelsea', points: 3, played: 6, won: 1, drawn: 0, lost: 5, goalsFor: 5, goalsAgainst: 17, goalDifference: -12 },
            { position: 12, team: 'Sevilla', points: 2, played: 6, won: 0, drawn: 2, lost: 4, goalsFor: 4, goalsAgainst: 18, goalDifference: -14 }
          ]);
        }
      }

    } catch (err) {
      setError('Error al cargar la tabla de posiciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopScorers = async () => {
    try {
      setLoadingScorers(true);

      const competitions = await apiService.getCompetitions();
      const championsLeague = competitions.data?.find(comp =>
        comp.name.toLowerCase().includes('champions') ||
        comp.name.toLowerCase().includes('uefa')
      );

      if (!championsLeague) {
        setScorersError('No se encontró la competición Champions League');
        setLoadingScorers(false);
        return;
      }

      const scorersData = await apiService.getTopScorers(championsLeague.id, null, 10);

      if (scorersData.scorers && scorersData.scorers.length > 0) {
        setTopScorers(scorersData.scorers);
      } else {
        // Mantener los datos actuales si existen, solo actualizar si no hay datos
        if (topScorers.length === 0) {
          setTopScorers([
            { display_name: 'Kylian Mbappé', team_name: 'Paris Saint-Germain', goals: 8, assists: 3 },
            { display_name: 'Erling Haaland', team_name: 'Manchester City', goals: 7, assists: 2 },
            { display_name: 'Robert Lewandowski', team_name: 'Barcelona', goals: 6, assists: 4 },
            { display_name: 'Lionel Messi', team_name: 'Inter Miami', goals: 5, assists: 5 },
            { display_name: 'Cristiano Ronaldo', team_name: 'Al-Nassr', goals: 5, assists: 1 }
          ]);
        }
      }

    } catch (err) {
      setScorersError('Error al cargar los máximos goleadores');
      console.error(err);
    } finally {
      setLoadingScorers(false);
    }
  };

  const fetchMatchesData = async (jornada = '') => {
    try {
      setLoadingMatches(true);
      setMatchesError(null); // Limpiar errores previos

      const competitions = await apiService.getCompetitions();
      const championsLeague = competitions.data?.find(comp =>
        comp.name.toLowerCase().includes('champions') ||
        comp.name.toLowerCase().includes('uefa')
      );

      if (!championsLeague) {
        setMatchesError('No se encontró la competición Champions League');
        setLoadingMatches(false);
        return;
      }

      console.log('Fetching matches for jornada:', jornada); // Debug log
      const matchesData = await apiService.getCompetitionMatches(championsLeague.id, jornada, 1, 18);
      console.log('Matches data received:', matchesData); // Debug log

      if (matchesData.matches) {
        setMatches(matchesData.matches);
        if (matchesData.jornadas && jornada === '') {
          // Solo actualizar jornadas cuando no hay filtro específico
          setJornadas(matchesData.jornadas);
        }
      } else {
        setMatchesError('No hay datos de partidos disponibles. Usando datos de ejemplo.');
        // Crear datos de ejemplo con partidos únicos para Champions League
        const exampleMatches = [];
        const championsTeams = [
          'Real Madrid', 'Bayern Munich', 'Manchester City', 'Paris Saint-Germain',
          'Liverpool', 'Inter Milan', 'Borussia Dortmund', 'Chelsea', 'Barcelona',
          'Juventus', 'Atlético Madrid', 'Sevilla', 'Napoli', 'Porto', 'Ajax',
          'Benfica', 'PSV Eindhoven', 'Sporting CP', 'Shakhtar Donetsk', 'Dinamo Zagreb',
          'Salzburg', 'Club Brugge', 'Celtic', 'Rangers', 'Galatasaray', 'Fenerbahçe',
          'Olympiakos', 'Panathinaikos', 'Slavia Prague', 'Sparta Prague', 'Young Boys',
          'Basel'
        ];

        // Crear partidos únicos asegurando que no se repitan equipos
        const usedTeams = new Set();
        let matchCount = 0;

        for (let i = 0; i < championsTeams.length && matchCount < 16; i += 2) {
          const homeTeam = championsTeams[i];
          const awayTeam = championsTeams[i + 1];

          if (homeTeam && awayTeam && !usedTeams.has(homeTeam) && !usedTeams.has(awayTeam)) {
            usedTeams.add(homeTeam);
            usedTeams.add(awayTeam);

            exampleMatches.push({
              id: `${selectedJornada || 1}-${matchCount + 1}`,
              match_date: '2024-11-05T20:00:00Z',
              homeTeam: { name: homeTeam, logo_url: '' },
              awayTeam: { name: awayTeam, logo_url: '' },
              home_score: Math.floor(Math.random() * 4),
              away_score: Math.floor(Math.random() * 4),
              status: 'finished',
              matchday: selectedJornada || 1
            });

            matchCount++;
          }
        }

        setMatches(exampleMatches);
      }

    } catch (err) {
      setMatchesError('Error al cargar los partidos');
      console.error('Error fetching matches:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  fetchChampionsStandings();
  fetchTopScorers();
  fetchMatchesData();
  }, []);

  return (
    <div className="champions-page">
      <div className="champions-hero">
        <div className="champions-logo-large">
          <img src="/assets/champions-logo.png" alt="UEFA Champions League" className="champions-logo-img" />
        </div>
        <h1>UEFA Champions League</h1>
        <p>La competición más prestigiosa del fútbol europeo</p>
      </div>

      <div className="champions-content">
        <div className="champions-stats">
          <div className="stat-card">
            <h3>32</h3>
            <p>Equipos</p>
          </div>
          <div className="stat-card">
            <h3>Europa</h3>
            <p>Cobertura</p>
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

        {activeTab === 'standings' && (
          <div className="standings-section">
            <h2>Tabla de Posiciones - Fase de Grupos</h2>

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
                    {standings.map((team) => {
                      let status = 'eliminated';
                      let statusText = '';

                      if (team.position <= 8) {
                        status = 'qualified';
                        statusText = 'Octavos';
                      } else if (team.position <= 24) {
                        status = 'playoff';
                        statusText = 'Play-off';
                      } else {
                        status = 'eliminated';
                        statusText = 'Eliminado';
                      }

                      return (
                        <tr key={team.position} className={`position-${status}`}>
                          <td className="position">{team.position}</td>
                          <td className="team-name">
                            <div className="team-info">
                              {team.logo && <img src={team.logo} alt={team.team} className="team-logo-small" />}
                              <span>{team.team}</span>
                            </div>
                          </td>
                          <td>{team.played}</td>
                          <td>{team.won}</td>
                          <td>{team.drawn}</td>
                          <td>{team.lost}</td>
                          <td>{team.goalsFor}</td>
                          <td>{team.goalsAgainst}</td>
                          <td className={team.goalDifference > 0 ? 'positive' : team.goalDifference < 0 ? 'negative' : ''}>
                            {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                          </td>
                          <td className="points">{team.points}</td>
                          <td className="status-cell">
                            <span className={`status-badge ${status}`}>
                              {statusText}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="standings-legend">
              <div className="legend-item">
                <span className="legend-color qualified"></span>
                <span>Clasificados a Octavos</span>
              </div>
              <div className="legend-item">
                <span className="legend-color playoff"></span>
                <span>Play-off</span>
              </div>
              <div className="legend-item">
                <span className="legend-color eliminated"></span>
                <span>Eliminados</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
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
                {selectedJornada ? (() => {
                  const jornada = parseInt(selectedJornada);
                  let jornadaLabel = `Jornada ${jornada}`;
                  if (jornada > 8) {
                    switch (jornada) {
                      case 9:
                        jornadaLabel = 'Play-offs';
                        break;
                      case 10:
                        jornadaLabel = 'Octavos de Final';
                        break;
                      case 11:
                        jornadaLabel = 'Cuartos de Final';
                        break;
                      case 12:
                        jornadaLabel = 'Semifinales';
                        break;
                      case 13:
                        jornadaLabel = 'Final';
                        break;
                      default:
                        jornadaLabel = `Fase ${jornada}`;
                    }
                  }
                  return jornadaLabel;
                })() : 'Selecciona Jornada'}
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
                        <span className="team-score">{match.status === 'timed' ? '-' : (match.status === 'finished' ? (match.home_score !== null ? match.home_score : 0) : (match.home_score !== null ? match.home_score : '-'))}</span>
                      </div>
                      <div className="vs-separator">vs</div>
                      <div className="team away-team">
                        <span className="team-score">{match.status === 'timed' ? '-' : (match.status === 'finished' ? (match.away_score !== null ? match.away_score : 0) : (match.away_score !== null ? match.away_score : '-'))}</span>
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
                         match.status === 'scheduled' ? 'Programado' :
                         match.status === 'timed' ? 'Programado' : match.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'scorers' && (
          <div className="top-scorers-section">
            <h2>Máximos Goleadores</h2>

            {loadingScorers ? (
              <div className="loading">
                <p>Cargando máximos goleadores...</p>
              </div>
            ) : scorersError ? (
              <div className="error">
                <p>{scorersError}</p>
              </div>
            ) : (
              <div className="scorers-table-container">
                <table className="scorers-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Jugador</th>
                      <th>Equipo</th>
                      <th>Goles</th>
                      <th>Asistencias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topScorers.map((scorer, index) => (
                      <tr key={index}>
                        <td className="position">{index + 1}</td>
                        <td className="player-name">
                          <div className="player-info">
                            {scorer.photo_url && <img src={scorer.photo_url} alt={scorer.display_name} className="player-photo-small" />}
                            <span>{scorer.display_name || `${scorer.first_name} ${scorer.last_name}`}</span>
                          </div>
                        </td>
                        <td className="team-name">
                          <div className="team-info">
                            {scorer.team_logo && <img src={scorer.team_logo} alt={scorer.team_name} className="team-logo-small" />}
                            <span>{scorer.team_name}</span>
                          </div>
                        </td>
                        <td className="goals">{scorer.goals}</td>
                        <td className="assists">{scorer.assists}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="champions-info">
          <h2>Sobre la Champions League</h2>
          <p>
            La UEFA Champions League es la competición de clubes más prestigiosa del mundo,
            donde los mejores equipos europeos compiten por el título más codiciado del fútbol continental.
          </p>
          <p>
            Desde 1955, ha reunido a los gigantes del fútbol europeo en una batalla épica
            por la supremacía continental, creando momentos inolvidables y leyendas del deporte.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Champions;