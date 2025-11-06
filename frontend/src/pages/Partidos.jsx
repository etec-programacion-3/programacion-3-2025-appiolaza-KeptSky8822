import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './Partidos.css';

const Partidos = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const data = await apiService.getMatches();
        setMatches(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los partidos');
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="partidos">
        <div className="page-header">
          <h1>Partidos</h1>
          <p>Resultados y próximos partidos de fútbol</p>
        </div>
        <div className="loading">
          <p>Cargando partidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="partidos">
        <div className="page-header">
          <h1>Partidos</h1>
          <p>Resultados y próximos partidos de fútbol</p>
        </div>
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="partidos">
      <div className="page-header">
        <h1>Partidos</h1>
        <p>Resultados y próximos partidos de fútbol</p>
      </div>

      <div className="matches-grid">
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.id} className="match-card">
              <div className="match-header">
                <span className="match-date">
                  {match.date ? new Date(match.date).toLocaleDateString() : 'Fecha N/A'}
                </span>
                <span className="match-status">
                  {match.status || 'Estado desconocido'}
                </span>
              </div>
              <div className="match-teams">
                <div className="team home-team">
                  <span className="team-name">{match.home_team_name || 'Equipo Local'}</span>
                </div>
                <div className="match-score">
                  <span className="score">
                    {match.home_score !== null && match.away_score !== null
                      ? `${match.home_score} - ${match.away_score}`
                      : 'VS'
                    }
                  </span>
                </div>
                <div className="team away-team">
                  <span className="team-name">{match.away_team_name || 'Equipo Visitante'}</span>
                </div>
              </div>
              <div className="match-info">
                <p><strong>Competición:</strong> {match.competition_name || 'N/A'}</p>
                <p><strong>Ronda:</strong> {match.round || 'N/A'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="content-placeholder">
            <div className="placeholder-icon">📅</div>
            <h2>No hay partidos disponibles</h2>
            <p>No se encontraron partidos en la base de datos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Partidos;