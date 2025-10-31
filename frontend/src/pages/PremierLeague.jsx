import React from 'react';
import './PremierLeague.css';

const PremierLeague = () => {
  const teams = [
    { id: 1, name: 'Manchester City', logo: '🇬🇧', city: 'Manchester' },
    { id: 2, name: 'Arsenal', logo: '🇬🇧', city: 'Londres' },
    { id: 3, name: 'Liverpool', logo: '🇬🇧', city: 'Liverpool' },
    { id: 4, name: 'Chelsea', logo: '🇬🇧', city: 'Londres' },
    { id: 5, name: 'Manchester United', logo: '🇬🇧', city: 'Manchester' },
    { id: 6, name: 'Tottenham Hotspur', logo: '🇬🇧', city: 'Londres' },
    { id: 7, name: 'Newcastle United', logo: '🇬🇧', city: 'Newcastle' },
    { id: 8, name: 'Aston Villa', logo: '🇬🇧', city: 'Birmingham' },
    { id: 9, name: 'Brighton & Hove Albion', logo: '🇬🇧', city: 'Brighton' },
    { id: 10, name: 'West Ham United', logo: '🇬🇧', city: 'Londres' },
    { id: 11, name: 'Crystal Palace', logo: '🇬🇧', city: 'Londres' },
    { id: 12, name: 'Fulham', logo: '🇬🇧', city: 'Londres' },
    { id: 13, name: 'Wolverhampton Wanderers', logo: '🇬🇧', city: 'Wolverhampton' },
    { id: 14, name: 'Everton', logo: '🇬🇧', city: 'Liverpool' },
    { id: 15, name: 'Brentford', logo: '🇬🇧', city: 'Londres' },
    { id: 16, name: 'Southampton', logo: '🇬🇧', city: 'Southampton' },
    { id: 17, name: 'Nottingham Forest', logo: '🇬🇧', city: 'Nottingham' },
    { id: 18, name: 'Bournemouth', logo: '🇬🇧', city: 'Bournemouth' },
    { id: 19, name: 'Ipswich Town', logo: '🇬🇧', city: 'Ipswich' },
    { id: 20, name: 'Leicester City', logo: '🇬🇧', city: 'Leicester' }
  ];

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

export default PremierLeague;