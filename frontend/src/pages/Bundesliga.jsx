import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './Bundesliga.css';

const Bundesliga = () => {
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
      setMatchesError(null);

      const competitions = await apiService.getCompetitions();
      const bundesliga = competitions.data?.find(comp =>
        comp.name.toLowerCase().includes('bundesliga') &&
        comp.country.toLowerCase().includes('germany')
      );

      if (!bundesliga) {
        setMatchesError('No se encontró la competición Bundesliga');
        setLoadingMatches(false);
        return;
      }

      console.log('Fetching matches for jornada:', jornada);
      const matchesData = await apiService.getCompetitionMatches(bundesliga.id, jornada);
      console.log('Matches data received:', matchesData);

      if (matchesData.matches) {
        setMatches(matchesData.matches);
        if (matchesData.jornadas && jornada === '') {
          setJornadas(matchesData.jornadas);
        }
      } else {
        if (matches.length === 0) {
          setMatchesError('No hay datos de partidos disponibles. Usando datos de ejemplo.');
          setMatches([
            {
              id: 1,
              match_date: '2024-11-05T18:30:00Z',
              homeTeam: { name: 'Bayern Munich', logo_url: '' },
              awayTeam: { name: 'Borussia Dortmund', logo_url: '' },
              home_score: 3,
              away_score: 2,
              status: 'finished',
              matchday: 11
            },
            {
              id: 2,
              match_date: '2024-11-05T15:30:00Z',
              homeTeam: { name: 'RB Leipzig', logo_url: '' },
              awayTeam: { name: 'Bayer Leverkusen', logo_url: '' },
              home_score: 2,
              away_score: 2,
              status: 'finished',
              matchday: 11
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
    const fetchBundesligaStandings = async () => {
      try {
        setLoading(true);

        const competitions = await apiService.getCompetitions();
        const bundesliga = competitions.data?.find(comp =>
          comp.name.toLowerCase().includes('bundesliga') &&
          comp.country.toLowerCase().includes('germany')
        );

        if (!bundesliga) {
          setError('No se encontró la competición Bundesliga');
          setLoading(false);
          return;
        }

        const standingsData = await apiService.getCompetitionStandings(bundesliga.id);

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
          if (standings.length === 0) {
            setStandings([
              { position: 1, team: 'Bayern Munich', points: 29, played: 11, won: 9, drawn: 2, lost: 0, goalsFor: 35, goalsAgainst: 10, goalDifference: 25 },
              { position: 2, team: 'Bayer Leverkusen', points: 26, played: 11, won: 8, drawn: 2, lost: 1, goalsFor: 30, goalsAgainst: 12, goalDifference: 18 },
              { position: 3, team: 'RB Leipzig', points: 24, played: 11, won: 7, drawn: 3, lost: 1, goalsFor: 28, goalsAgainst: 14, goalDifference: 14 },
              { position: 4, team: 'Borussia Dortmund', points: 22, played: 11, won: 7, drawn: 1, lost: 3, goalsFor: 26, goalsAgainst: 16, goalDifference: 10 },
              { position: 5, team: 'SC Freiburg', points: 20, played: 11, won: 6, drawn: 2, lost: 3, goalsFor: 22, goalsAgainst: 15, goalDifference: 7 },
              { position: 6, team: 'Eintracht Frankfurt', points: 19, played: 11, won: 6, drawn: 1, lost: 4, goalsFor: 24, goalsAgainst: 18, goalDifference: 6 },
              { position: 7, team: 'Union Berlin', points: 17, played: 11, won: 5, drawn: 2, lost: 4, goalsFor: 18, goalsAgainst: 17, goalDifference: 1 },
              { position: 8, team: 'VfB Stuttgart', points: 16, played: 11, won: 4, drawn: 4, lost: 3, goalsFor: 19, goalsAgainst: 18, goalDifference: 1 },
              { position: 9, team: 'Borussia Mönchengladbach', points: 15, played: 11, won: 4, drawn: 3, lost: 4, goalsFor: 17, goalsAgainst: 19, goalDifference: -2 },
              { position: 10, team: 'VfL Wolfsburg', points: 14, played: 11, won: 4, drawn: 2, lost: 5, goalsFor: 16, goalsAgainst: 19, goalDifference: -3 },
              { position: 11, team: 'Werder Bremen', points: 13, played: 11, won: 4, drawn: 1, lost: 6, goalsFor: 15, goalsAgainst: 20, goalDifference: -5 },
              { position: 12, team: 'FC Augsburg', points: 12, played: 11, won: 3, drawn: 3, lost: 5, goalsFor: 14, goalsAgainst: 21, goalDifference: -7 },
              { position: 13, team: 'TSG Hoffenheim', points: 11, played: 11, won: 3, drawn: 2, lost: 6, goalsFor: 13, goalsAgainst: 22, goalDifference: -9 },
              { position: 14, team: '1. FC Köln', points: 10, played: 11, won: 3, drawn: 1, lost: 7, goalsFor: 12, goalsAgainst: 23, goalDifference: -11 },
              { position: 15, team: 'Mainz 05', points: 9, played: 11, won: 2, drawn: 3, lost: 6, goalsFor: 11, goalsAgainst: 24, goalDifference: -13 },
              { position: 16, team: 'VfL Bochum', points: 8, played: 11, won: 2, drawn: 2, lost: 7, goalsFor: 10, goalsAgainst: 25, goalDifference: -15 },
              { position: 17, team: 'FC Heidenheim', points: 7, played: 11, won: 2, drawn: 1, lost: 8, goalsFor: 9, goalsAgainst: 26, goalDifference: -17 },
              { position: 18, team: 'SV Darmstadt 98', points: 5, played: 11, won: 1, drawn: 2, lost: 8, goalsFor: 8, goalsAgainst: 28, goalDifference: -20 }
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
        const bundesliga = competitions.data?.find(comp =>
          comp.name.toLowerCase().includes('bundesliga') &&
          comp.country.toLowerCase().includes('germany')
        );

        if (!bundesliga) {
          setScorersError('No se encontró la competición Bundesliga');
          setLoadingScorers(false);
          return;
        }

        const scorersData = await apiService.getTopScorers(bundesliga.id, null, 10);

        if (scorersData.scorers && scorersData.scorers.length > 0) {
          setTopScorers(scorersData.scorers);
        } else {
          if (topScorers.length === 0) {
            setTopScorers([
              { display_name: 'Harry Kane', team_name: 'Bayern Munich', goals: 14, assists: 5 },
              { display_name: 'Serhou Guirassy', team_name: 'VfB Stuttgart', goals: 11, assists: 3 },
              { display_name: 'Niclas Füllkrug', team_name: 'Borussia Dortmund', goals: 10, assists: 2 },
              { display_name: 'Loïs Openda', team_name: 'RB Leipzig', goals: 9, assists: 4 },
              { display_name: 'Victor Boniface', team_name: 'Bayer Leverkusen', goals: 9, assists: 6 }
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

    fetchBundesligaStandings();
    fetchTopScorers();
    fetchMatches();
  }, []);

  return (
    <div className="bundesliga-page">
      <div className="bundesliga-hero">
        <div className="bundesliga-logo-large">
          ⚽
        </div>
        <h1>Bundesliga</h1>
        <p>La liga de fútbol más emocionante de Alemania</p>
      </div>

      <div className="bundesliga-content">
        <div className="bundesliga-stats">
          <div className="stat-card">
            <h3>18</h3>
            <p>Equipos</p>
          </div>
          <div className="stat-card">
            <h3>Alemania</h3>
            <p>País</p>
          </div>
          <div className="stat-card">
            <h3>2024-25</h3>
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
            <h2>Tabla de Posiciones</h2>

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
                      let status = 'midtable';
                      let statusText = '';

                      if (team.position <= 4) {
                        status = 'champions';
                        statusText = 'Champions';
                      } else if (team.position === 5) {
                        status = 'europa';
                        statusText = 'Europa League';
                      } else if (team.position === 6) {
                        status = 'conference';
                        statusText = 'Conference';
                      } else if (team.position === 16) {
                        status = 'playoff';
                        statusText = 'Play-off';
                      } else if (team.position >= 17) {
                        status = 'relegation';
                        statusText = 'Descenso';
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
                            {statusText && (
                              <span className={`status-badge ${status}`}>
                                {statusText}
                              </span>
                            )}
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
                <span className="legend-color champions"></span>
                <span>Champions League</span>
              </div>
              <div className="legend-item">
                <span className="legend-color europa"></span>
                <span>Europa League</span>
              </div>
              <div className="legend-item">
                <span className="legend-color conference"></span>
                <span>Conference League</span>
              </div>
              <div className="legend-item">
                <span className="legend-color playoff"></span>
                <span>Play-off Descenso</span>
              </div>
              <div className="legend-item">
                <span className="legend-color relegation"></span>
                <span>Descenso</span>
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

        <div className="bundesliga-info">
          <h2>Sobre la Bundesliga</h2>
          <p>
            La Bundesliga es la máxima categoría del fútbol profesional alemán y una de las ligas
            más competitivas de Europa. Fundada en 1963, se caracteriza por su atmósfera única,
            estadios llenos y una pasión incomparable por el fútbol.
          </p>
          <p>
            Con equipos legendarios como Bayern Munich, Borussia Dortmund y RB Leipzig, la Bundesliga
            es conocida por su estilo de juego ofensivo, precios accesibles para los aficionados y
            el famoso "Der Klassiker" entre Bayern y Dortmund.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bundesliga;