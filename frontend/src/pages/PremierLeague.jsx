import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './PremierLeague.css';

const PremierLeague = () => {
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

  const fetchPremierLeagueStandings = async () => {
    try {
      setLoading(true);

      const competitions = await apiService.getCompetitions();
      const premierLeague = competitions.data?.find(comp =>
        comp.name.toLowerCase().includes('premier league') ||
        comp.name.toLowerCase().includes('premier') ||
        comp.code === 'PL'
      );

      if (!premierLeague) {
        setError('No se encontró la competición Premier League');
        setLoading(false);
        return;
      }

      const standingsData = await apiService.getCompetitionStandings(premierLeague.id);

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
            { position: 1, team: 'Manchester City', points: 15, played: 6, won: 5, drawn: 0, lost: 1, goalsFor: 18, goalsAgainst: 8, goalDifference: 10 },
            { position: 2, team: 'Arsenal', points: 13, played: 6, won: 4, drawn: 1, lost: 1, goalsFor: 16, goalsAgainst: 7, goalDifference: 9 },
            { position: 3, team: 'Liverpool', points: 12, played: 6, won: 4, drawn: 0, lost: 2, goalsFor: 14, goalsAgainst: 9, goalDifference: 5 },
            { position: 4, team: 'Chelsea', points: 10, played: 6, won: 3, drawn: 1, lost: 2, goalsFor: 12, goalsAgainst: 10, goalDifference: 2 },
            { position: 5, team: 'Manchester United', points: 9, played: 6, won: 3, drawn: 0, lost: 3, goalsFor: 11, goalsAgainst: 12, goalDifference: -1 },
            { position: 6, team: 'Tottenham Hotspur', points: 8, played: 6, won: 2, drawn: 2, lost: 2, goalsFor: 10, goalsAgainst: 11, goalDifference: -1 },
            { position: 7, team: 'Newcastle United', points: 7, played: 6, won: 2, drawn: 1, lost: 3, goalsFor: 9, goalsAgainst: 13, goalDifference: -4 },
            { position: 8, team: 'Aston Villa', points: 6, played: 6, won: 2, drawn: 0, lost: 4, goalsFor: 8, goalsAgainst: 14, goalDifference: -6 },
            { position: 9, team: 'Brighton & Hove Albion', points: 5, played: 6, won: 1, drawn: 2, lost: 3, goalsFor: 7, goalsAgainst: 15, goalDifference: -8 },
            { position: 10, team: 'West Ham United', points: 4, played: 6, won: 1, drawn: 1, lost: 4, goalsFor: 6, goalsAgainst: 16, goalDifference: -10 }
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
      const premierLeague = competitions.data?.find(comp =>
        comp.name.toLowerCase().includes('premier league') ||
        comp.name.toLowerCase().includes('premier') ||
        comp.code === 'PL'
      );

      if (!premierLeague) {
        setScorersError('No se encontró la competición Premier League');
        setLoadingScorers(false);
        return;
      }

      const scorersData = await apiService.getTopScorers(premierLeague.id, null, 10);

      if (scorersData.scorers && scorersData.scorers.length > 0) {
        setTopScorers(scorersData.scorers);
      } else {
        // Mantener los datos actuales si existen, solo actualizar si no hay datos
        if (topScorers.length === 0) {
          setTopScorers([
            { display_name: 'Erling Haaland', team_name: 'Manchester City', goals: 12, assists: 4 },
            { display_name: 'Mohamed Salah', team_name: 'Liverpool', goals: 10, assists: 6 },
            { display_name: 'Son Heung-min', team_name: 'Tottenham Hotspur', goals: 9, assists: 5 },
            { display_name: 'Bukayo Saka', team_name: 'Arsenal', goals: 8, assists: 7 },
            { display_name: 'Harry Kane', team_name: 'Bayern Munich', goals: 7, assists: 3 }
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

  const fetchMatches = async (jornada = '') => {
    try {
      setLoadingMatches(true);
      setMatchesError(null);

      const competitions = await apiService.getCompetitions();
      const premierLeague = competitions.data?.find(comp =>
        comp.name.toLowerCase().includes('premier league') ||
        comp.name.toLowerCase().includes('premier') ||
        comp.code === 'PL'
      );

      if (!premierLeague) {
        setMatchesError('No se encontró la competición Premier League');
        setLoadingMatches(false);
        return;
      }

      const matchesData = await apiService.getCompetitionMatches(premierLeague.id, jornada);

      if (matchesData.matches) {
        setMatches(matchesData.matches);
        if (matchesData.jornadas && jornada === '') {
          setJornadas(matchesData.jornadas);
        }
      } else {
        // Mantener los datos actuales si existen, solo actualizar si no hay datos
        if (matches.length === 0) {
          setMatches([
            {
              id: 1,
              match_date: '2024-11-05T20:00:00Z',
              homeTeam: { name: 'Manchester City', logo_url: '' },
              awayTeam: { name: 'Liverpool', logo_url: '' },
              home_score: 2,
              away_score: 1,
              status: 'finished',
              matchday: 4
            },
            {
              id: 2,
              match_date: '2024-11-05T20:00:00Z',
              homeTeam: { name: 'Arsenal', logo_url: '' },
              awayTeam: { name: 'Chelsea', logo_url: '' },
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
      console.error(err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleJornadaChange = async (jornada) => {
    setSelectedJornada(jornada);
    await fetchMatches(jornada);
  };

  useEffect(() => {
    fetchPremierLeagueStandings();
    fetchTopScorers();
    fetchMatches();
  }, []);

  return (
    <div className="premier-league">
      <div className="page-header">
        <h1>Premier League</h1>
        <p>La máxima competición del fútbol inglés</p>
      </div>

      <div className="competition-info-section">
        <div className="competition-stats">
          <div className="stat-card">
            <h3>20</h3>
            <p>Equipos</p>
          </div>
          <div className="stat-card">
            <h3>Inglaterra</h3>
            <p>País</p>
          </div>
          <div className="stat-card">
            <h3>2025-26</h3>
            <p>Temporada</p>
          </div>
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
          <h2>Tabla de Posiciones - Temporada 2024-25</h2>

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
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team) => (
                    <tr key={team.position}>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

      <div className="competition-description">
        <h2>Sobre la Premier League</h2>
        <p>
          La Premier League es la máxima categoría del sistema de ligas de fútbol de Inglaterra.
          Es considerada la competición de clubes más vista en el mundo y una de las más
          prestigiosas del fútbol internacional.
        </p>
        <p>
          Fundada en 1992, la Premier League reúne a los mejores equipos ingleses en una
          batalla anual por el título de campeón, ofreciendo fútbol de élite y contribuyendo
          al desarrollo del fútbol mundial.
        </p>
      </div>
    </div>
  );
};

export default PremierLeague;