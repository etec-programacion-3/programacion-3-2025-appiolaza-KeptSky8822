import React from 'react';
import './SerieA.css';

const SerieA = () => {
  return (
    <div className="serie-a-page">
      <div className="serie-a-hero">
        <div className="serie-a-logo-large">
          ⚽
        </div>
        <h1>Serie A</h1>
        <p>La liga más apasionante del fútbol italiano</p>
      </div>

      <div className="serie-a-content">
        <div className="serie-a-stats">
          <div className="stat-card">
            <h3>20</h3>
            <p>Equipos</p>
          </div>
          <div className="stat-card">
            <h3>Italia</h3>
            <p>Cobertura</p>
          </div>
          <div className="stat-card">
            <h3>2025-26</h3>
            <p>Temporada</p>
          </div>
        </div>

        <div className="serie-a-info">
          <h2>Sobre la Serie A</h2>
          <p>
            La Serie A es la máxima categoría del sistema de ligas de fútbol de Italia,
            considerada una de las competiciones más prestigiosas y emocionantes del mundo.
          </p>
          <p>
            Fundada en 1898, reúne a los mejores equipos italianos en una batalla anual
            por el título de campeón, ofreciendo fútbol de alta calidad y momentos inolvidables.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SerieA;