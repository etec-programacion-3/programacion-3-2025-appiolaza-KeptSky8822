import React from 'react';
import './Champions.css';

const Champions = () => {
  return (
    <div className="champions-page">
      <div className="champions-hero">
        <div className="champions-logo-large">
          🏆
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
            <h3>2024-25</h3>
            <p>Temporada</p>
          </div>
        </div>

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