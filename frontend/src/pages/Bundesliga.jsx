import React from 'react';
import './Bundesliga.css';

const Bundesliga = () => {
  return (
    <div className="bundesliga-page">
      <div className="bundesliga-hero">
        <div className="bundesliga-logo-large">
          ⚽
        </div>
        <h1>Bundesliga</h1>
        <p>La liga más competitiva del fútbol alemán</p>
      </div>

      <div className="bundesliga-content">
        <div className="bundesliga-stats">
          <div className="stat-card">
            <h3>18</h3>
            <p>Equipos</p>
          </div>
          <div className="stat-card">
            <h3>Alemania</h3>
            <p>Cobertura</p>
          </div>
          <div className="stat-card">
            <h3>2025-26</h3>
            <p>Temporada</p>
          </div>
        </div>

        <div className="bundesliga-info">
          <h2>Sobre la Bundesliga</h2>
          <p>
            La Bundesliga es la máxima categoría del sistema de ligas de fútbol de Alemania,
            reconocida por su alta calidad futbolística y su competitividad extrema.
          </p>
          <p>
            Fundada en 1963, reúne a los mejores equipos alemanes en una batalla anual
            por el título de campeón, ofreciendo fútbol de élite y momentos inolvidables.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bundesliga;