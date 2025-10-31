import React from 'react';
import './Ligue1.css';

const Ligue1 = () => {
  const teams = [
    { id: 1, name: 'Paris Saint-Germain', logo: '🇫🇷', city: 'París' },
    { id: 2, name: 'Olympique de Marseille', logo: '🇫🇷', city: 'Marsella' },
    { id: 3, name: 'AS Monaco', logo: '🇲🇨', city: 'Mónaco' },
    { id: 4, name: 'Olympique Lyonnais', logo: '🇫🇷', city: 'Lyon' },
    { id: 5, name: 'Lille OSC', logo: '🇫🇷', city: 'Lille' },
    { id: 6, name: 'Stade Rennais', logo: '🇫🇷', city: 'Rennes' },
    { id: 7, name: 'OGC Nice', logo: '🇫🇷', city: 'Niza' },
    { id: 8, name: 'RC Lens', logo: '🇫🇷', city: 'Lens' },
    { id: 9, name: 'FC Nantes', logo: '🇫🇷', city: 'Nantes' },
    { id: 10, name: 'Montpellier HSC', logo: '🇫🇷', city: 'Montpellier' },
    { id: 11, name: 'Stade Brestois', logo: '🇫🇷', city: 'Brest' },
    { id: 12, name: 'Toulouse FC', logo: '🇫🇷', city: 'Toulouse' },
    { id: 13, name: 'RC Strasbourg', logo: '🇫🇷', city: 'Estrasburgo' },
    { id: 14, name: 'Angers SCO', logo: '🇫🇷', city: 'Angers' },
    { id: 15, name: 'AS Saint-Étienne', logo: '🇫🇷', city: 'Saint-Étienne' },
    { id: 16, name: 'Le Havre AC', logo: '🇫🇷', city: 'Le Havre' },
    { id: 17, name: 'FC Metz', logo: '🇫🇷', city: 'Metz' },
    { id: 18, name: 'Clermont Foot', logo: '🇫🇷', city: 'Clermont-Ferrand' }
  ];

  return (
    <div className="ligue-1">
      <div className="page-header">
        <h1>Ligue 1</h1>
        <p>La máxima competición del fútbol francés</p>
      </div>

      <div className="competition-info-section">
        <div className="competition-stats">
          <div className="stat-card">
            <h3>18</h3>
            <p>Equipos</p>
          </div>
          <div className="stat-card">
            <h3>Francia</h3>
            <p>País</p>
          </div>
          <div className="stat-card">
            <h3>2025-26</h3>
            <p>Temporada</p>
          </div>
        </div>

        <div className="competition-description">
          <h2>Sobre la Ligue 1</h2>
          <p>
            La Ligue 1 es la máxima categoría del sistema de ligas de fútbol de Francia.
            Es considerada una de las competiciones más emocionantes del fútbol europeo,
            conocida por su intensidad y calidad futbolística.
          </p>
          <p>
            Fundada en 1932, la Ligue 1 reúne a los mejores equipos franceses en una
            batalla anual por el título de campeón, ofreciendo momentos inolvidables
            y contribuyendo al desarrollo del fútbol internacional.
          </p>
        </div>
      </div>

      <div className="teams-section">
        <h2>Equipos Participantes</h2>
        <div className="teams-grid">
          {teams.map((team) => (
            <div key={team.id} className="team-card">
              <div className="team-logo">
                {team.logo}
              </div>
              <div className="team-info">
                <h3 className="team-name">{team.name}</h3>
                <p className="team-city">{team.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ligue1;