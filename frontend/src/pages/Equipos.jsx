import React from 'react';
import './Equipos.css';

const Equipos = () => {
  const competitions = [
    {
      id: 1,
      name: 'Champions League',
      logo: '🏆',
      country: 'Europe',
      teams: 32,
      status: 'active'
    },
    {
      id: 2,
      name: 'Premier League',
      logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      country: 'England',
      teams: 20,
      status: 'active'
    },
    {
      id: 3,
      name: 'La Liga',
      logo: '🇪🇸',
      country: 'Spain',
      teams: 20,
      status: 'active'
    },
    {
      id: 4,
      name: 'Serie A',
      logo: '🇮🇹',
      country: 'Italy',
      teams: 20,
      status: 'active'
    },
    {
      id: 5,
      name: 'Bundesliga',
      logo: '🇩🇪',
      country: 'Germany',
      teams: 18,
      status: 'active'
    },
    {
      id: 6,
      name: 'Ligue 1',
      logo: '🇫🇷',
      country: 'France',
      teams: 18,
      status: 'active'
    }
  ];

  return (
    <div className="equipos">
      <div className="page-header">
        <h1>Competiciones</h1>
        <p>Las principales competiciones de fútbol europeo</p>
      </div>

      <div className="competitions-grid">
        {competitions.map((competition) => (
          <div key={competition.id} className="competition-card">
            <div className="competition-header">
              <div className="competition-logo">
                {competition.logo}
              </div>
              <div className="competition-status">
                <span className={`status-badge ${competition.status}`}>
                  {competition.status === 'active' ? 'Activa' : 'Finalizada'}
                </span>
              </div>
            </div>

            <div className="competition-info">
              <h3 className="competition-name">{competition.name}</h3>
              <div className="competition-details">
                <span className="competition-country">
                  <span className="country-flag">{competition.logo}</span>
                  {competition.country}
                </span>
                <span className="competition-teams">
                  {competition.teams} equipos
                </span>
              </div>
            </div>

            <div className="competition-actions">
              <button className="btn btn-primary competition-btn">
                Ver Equipos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipos;