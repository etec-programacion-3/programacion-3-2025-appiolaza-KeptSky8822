import React from 'react';
import './LaLiga.css';

const LaLiga = () => {
  const teams = [
    { id: 1, name: 'Real Madrid', logo: '🇪🇸', city: 'Madrid' },
    { id: 2, name: 'FC Barcelona', logo: '🇪🇸', city: 'Barcelona' },
    { id: 3, name: 'Atlético Madrid', logo: '🇪🇸', city: 'Madrid' },
    { id: 4, name: 'Sevilla FC', logo: '🇪🇸', city: 'Sevilla' },
    { id: 5, name: 'Valencia CF', logo: '🇪🇸', city: 'Valencia' },
    { id: 6, name: 'Real Sociedad', logo: '🇪🇸', city: 'San Sebastián' },
    { id: 7, name: 'Villarreal CF', logo: '🇪🇸', city: 'Villarreal' },
    { id: 8, name: 'Real Betis', logo: '🇪🇸', city: 'Sevilla' },
    { id: 9, name: 'Athletic Club', logo: '🇪🇸', city: 'Bilbao' },
    { id: 10, name: 'RC Celta', logo: '🇪🇸', city: 'Vigo' },
    { id: 11, name: 'RCD Mallorca', logo: '🇪🇸', city: 'Palma' },
    { id: 12, name: 'Rayo Vallecano', logo: '🇪🇸', city: 'Madrid' },
    { id: 13, name: 'Girona FC', logo: '🇪🇸', city: 'Girona' },
    { id: 14, name: 'UD Las Palmas', logo: '🇪🇸', city: 'Las Palmas' },
    { id: 15, name: 'Deportivo Alavés', logo: '🇪🇸', city: 'Vitoria' },
    { id: 16, name: 'RCD Espanyol', logo: '🇪🇸', city: 'Barcelona' },
    { id: 17, name: 'Getafe CF', logo: '🇪🇸', city: 'Getafe' },
    { id: 18, name: 'Real Valladolid', logo: '🇪🇸', city: 'Valladolid' },
    { id: 19, name: 'SD Eibar', logo: '🇪🇸', city: 'Eibar' },
    { id: 20, name: 'Elche CF', logo: '🇪🇸', city: 'Elche' }
  ];

  return (
    <div className="laliga">
      <div className="page-header">
        <h1>La Liga</h1>
        <p>La máxima competición del fútbol español</p>
      </div>

      <div className="competition-info-section">
        <div className="competition-stats">
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

        <div className="competition-description">
          <h2>Sobre La Liga</h2>
          <p>
            La Liga es la máxima categoría del sistema de ligas de fútbol de España.
            Es considerada una de las competiciones más importantes del mundo,
            conocida por su intensidad y calidad futbolística excepcional.
          </p>
          <p>
            Fundada en 1929, La Liga reúne a los mejores equipos españoles en una
            batalla anual por el título de campeón, ofreciendo fútbol de élite y
            siendo cuna de grandes estrellas internacionales.
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

export default LaLiga;