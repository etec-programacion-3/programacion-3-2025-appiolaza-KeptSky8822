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
      color: 'linear-gradient(135deg, #4c1d95 0%, #581c87 50%, #6d28d9 100%)',
      hasImage: true,
      imagePath: '/assets/premier-league-logo.png'
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
      color: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%)',
      hasImage: true,
      imagePath: '/assets/serie-a-logo.png'
    },
    {
      id: 5,
      name: 'Bundesliga',
      logo: '🇩🇪',
      country: 'Germany',
      teams: 18,
      status: 'active',
      color: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)',
      hasImage: true,
      imagePath: '/assets/bundesliga-logo.png'
    },
    {
      id: 6,
      name: 'Ligue 1',
      logo: '🇫🇷',
      country: 'France',
      teams: 18,
      status: 'active',
      color: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
      hasImage: true,
      imagePath: '/assets/ligue-1-logo.jpg'
    }
  ];

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <div className="hero-subtitle">Bienvenido a</div>
          <h1>Football Vision</h1>
          <p>
            Tu plataforma definitiva para seguir las mejores competiciones de fútbol europeo. 
            Estadísticas en tiempo real, clasificaciones actualizadas y toda la información 
            que necesitas de las ligas más prestigiosas del continente.
          </p>
        </div>
      </div>

      <div className="competitions-showcase">
        {competitions.map((competition) => (
          <Link
            key={competition.id}
            to={
              competition.id === 1 ? "/champions" :
              competition.id === 2 ? "/premier-league" :
              competition.id === 3 ? "/laliga" :
              competition.id === 4 ? "/serie-a" :
              competition.id === 5 ? "/bundesliga" :
              competition.id === 6 ? "/ligue-1" :
              "/equipos"
            }
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