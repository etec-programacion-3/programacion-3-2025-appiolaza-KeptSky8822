import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './Estadisticas.css';

const Estadisticas = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCompetitions();
        setCompetitions(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las competiciones');
        console.error('Error fetching competitions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  if (loading) {
    return (
      <div className="estadisticas">
        <div className="page-header">
          <h1>Estadísticas</h1>
          <p>Datos y métricas del fútbol</p>
        </div>
        <div className="loading">
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="estadisticas">
        <div className="page-header">
          <h1>Estadísticas</h1>
          <p>Datos y métricas del fútbol</p>
        </div>
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="estadisticas">
      <div className="page-header">
        <h1>Estadísticas</h1>
        <p>Datos y métricas del fútbol</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total de Competiciones</h3>
          <div className="stat-number">{competitions.length}</div>
        </div>
        <div className="stat-card">
          <h3>Competiciones Activas</h3>
          <div className="stat-number">
            {competitions.filter(comp => comp.status === 'active').length}
          </div>
        </div>
      </div>

      <div className="competitions-stats">
        <h2>Competiciones Disponibles</h2>
        {competitions.length > 0 ? (
          <div className="competitions-list">
            {competitions.map((competition) => (
              <div key={competition.id} className="competition-stat-card">
                <div className="competition-header">
                  <h3>{competition.name}</h3>
                  <span className={`status-badge ${competition.status}`}>
                    {competition.status === 'active' ? 'Activa' : 'Finalizada'}
                  </span>
                </div>
                <div className="competition-details">
                  <p><strong>País:</strong> {competition.country || 'N/A'}</p>
                  <p><strong>Temporada:</strong> {competition.season || 'N/A'}</p>
                  <p><strong>Equipos:</strong> {competition.number_of_teams || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="content-placeholder">
            <div className="placeholder-icon">📊</div>
            <h2>No hay estadísticas disponibles</h2>
            <p>No se encontraron competiciones en la base de datos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Estadisticas;