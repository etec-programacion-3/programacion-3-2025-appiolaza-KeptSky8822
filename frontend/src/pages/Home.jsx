import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const competitions = [
    {
      id: 1,
      name: 'Champions League',
      logo: '🏆',
      country: 'Europe',
      teams: 32,
      status: 'active',
      color: 'linear-gradient(135deg, #001122 0%, #002244 50%, #003366 100%)',
      isChampions: true
    },
    {
      id: 2,
      name: 'Premier League',
      logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      country: 'England',
      teams: 20,
      status: 'active',
      color: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
    },
    {
      id: 3,
      name: 'La Liga',
      logo: '🇪🇸',
      country: 'Spain',
      teams: 20,
      status: 'active',
      color: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 50%, #7f1d1d 100%)',
      hasImage: true,
      imagePath: '/assets/laliga-logo.png'
    },
    {
      id: 4,
      name: 'Serie A',
      logo: '🇮🇹',
      country: 'Italy',
      teams: 20,
      status: 'active',
      color: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
    },
    {
      id: 5,
      name: 'Bundesliga',
      logo: '🇩🇪',
      country: 'Germany',
      teams: 18,
      status: 'active',
      color: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
    },
    {
      id: 6,
      name: 'Ligue 1',
      logo: '🇫🇷',
      country: 'France',
      teams: 18,
      status: 'active',
      color: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)'
    }
  ];

  return (
    <div className="home">
      <div className="hero">
        <h1>Football Vision</h1>
        <p>Las mejores competiciones de fútbol europeo</p>
      </div>

      <div className="competitions-showcase">
        {competitions.map((competition) => (
          <Link
            key={competition.id}
            to={competition.id === 1 ? "/champions" : "/equipos"}
            className={`competition-showcase-card ${competition.isChampions ? 'champions-card-special' : ''}`}
            style={{ background: competition.color }}
          >
            <div className="competition-showcase-header">
              <div className="competition-showcase-status">
                <span className="status-badge active">ACTIVA</span>
              </div>
            </div>

            <div className="competition-full-card">
              {competition.isChampions || competition.hasImage ? (
                <>
                  <img
                    src={competition.isChampions ? "/assets/champions-logo.png" : competition.imagePath}
                    alt={`${competition.name} Logo`}
                    className="champions-full-logo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="competition-full-logo-fallback" style={{ display: 'none' }}>
                    {competition.logo}
                  </div>
                </>
              ) : (
                <div className="competition-full-logo">
                  {competition.logo}
                </div>
              )}
            </div>

          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;