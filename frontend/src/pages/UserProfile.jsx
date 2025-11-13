import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);

    if (!token) {
        setLoading(false);
        return;
    }

    const fetchFavorites = async () => {
      try {
        // 1. Obtener Equipos Favoritos
        let teams = [];
        try {
          const teamRes = await axios.get('http://localhost:3000/api/favorite', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('🧩 Respuesta completa equipos:', teamRes.data);
          
          // Normalizar la respuesta de equipos
          if (Array.isArray(teamRes.data)) {
            teams = teamRes.data;
          } else if (teamRes.data && typeof teamRes.data === 'object' && teamRes.data.id) {
            teams = [teamRes.data];
          }
          console.log('✅ Equipos procesados:', teams);
        } catch (teamErr) {
          // Si es 404, significa que no hay equipos favoritos
          if (teamErr.response?.status === 404) {
            console.log('ℹ️ No hay equipos favoritos (404)');
            teams = [];
          } else {
            console.error('❌ Error al obtener equipos:', teamErr);
            teams = [];
          }
        }
        setFavoriteTeams(teams);

        // 2. Obtener Jugadores Favoritos
        let players = [];
        try {
          const playerRes = await axios.get('http://localhost:3000/api/favorite-players', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('⚽ Respuesta completa jugadores:', playerRes.data);
          
          // Normalizar la respuesta de jugadores
          if (Array.isArray(playerRes.data)) {
            players = playerRes.data;
          } else if (playerRes.data && typeof playerRes.data === 'object' && playerRes.data.id) {
            players = [playerRes.data];
          }
          
          // Procesar jugadores para asegurar que tengan la estructura correcta
          players = players.map(player => {
            console.log('🔍 Procesando jugador individual:', player);
            console.log('   - photo_url:', player.photo_url);
            console.log('   - Todas las propiedades:', Object.keys(player));
            
            return {
              id: player.id,
              full_name: player.full_name || `${player.first_name || ''} ${player.last_name || ''}`.trim(),
              position: player.position || 'Jugador',
              photo_url: player.photo_url || player.photoUrl || player.image_url || player.photo || null,
              first_name: player.first_name,
              last_name: player.last_name
            };
          });
          
          console.log('✅ Jugadores procesados:', players);
        } catch (playerErr) {
          // Si es 404, significa que no hay jugadores favoritos
          if (playerErr.response?.status === 404) {
            console.log('ℹ️ No hay jugadores favoritos (404)');
            players = [];
          } else {
            console.error('❌ Error al obtener jugadores:', playerErr);
            players = [];
          }
        }
        setFavoritePlayers(players);

      } catch (err) {
        console.error('❌ Error general al obtener favoritos:', err);
        setFavoriteTeams([]);
        setFavoritePlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p className="loading-text">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Header del Perfil */}
        <div className="profile-card">
          <div className="profile-banner"></div>
          <div className="profile-info">
            <div className="avatar-section">
              <div className="avatar">
                <svg className="avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx={12} cy={7} r={4} />
                </svg>
              </div>
              <div className="user-details">
                <h1 className="username">{user.username}</h1>
                <div className="user-email">
                  <svg className="email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Sección de Equipos Favoritos */}
        <div className="favorites-card teams-favorites-card">
          <div className="favorites-header">
            <div className="favorites-icon-wrapper">
              <svg className="favorites-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <div>
              <h2 className="favorites-title">Equipos Favoritos</h2>
              <p className="favorites-subtitle">
                {favoriteTeams.length > 0 
                  ? `${favoriteTeams.length} ${favoriteTeams.length === 1 ? 'equipo' : 'equipos'} en tu lista`
                  : 'Todavía no agregaste equipos'}
              </p>
            </div>
          </div>

          {favoriteTeams.length > 0 ? (
            <div className="favorites-grid team-grid">
              {favoriteTeams.map((fav, index) => (
                <Link to={`/teams/${fav.id}`} key={fav.id || index} className="team-card favorite-item-card">
                  <div className="team-content">
                    {fav.logo_url ? (
                      <img
                        src={fav.logo_url}
                        alt={fav.name}
                        className="team-logo"
                      />
                    ) : (
                      <div className="team-logo-placeholder">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="team-info">
                      <h3 className="team-name">{fav.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </div>
              <p className="empty-title">No tenés equipos favoritos aún</p>
              <p className="empty-subtitle">Empezá a seguir a tus equipos preferidos</p>
            </div>
          )}
        </div>
        
        {/* Sección de Jugadores Favoritos */}
        <div className="favorites-card players-favorites-card">
          <div className="favorites-header">
            <div className="favorites-icon-wrapper">
              <svg className="favorites-icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 0-7.23 3.09l7.23 7.23 7.23-7.23A10 10 0 0 0 12 2z" fill="#fff" /> 
                <path d="M12 22a10 10 0 0 0 7.23-3.09l-7.23-7.23-7.23 7.23A10 10 0 0 0 12 22z" fill="#fff" /> 
                <path d="M10 8l4 4-4 4" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="favorites-title">Jugadores Favoritos</h2>
              <p className="favorites-subtitle">
                {favoritePlayers.length > 0 
                  ? `${favoritePlayers.length} ${favoritePlayers.length === 1 ? 'jugador' : 'jugadores'} en tu lista`
                  : 'Todavía no agregaste jugadores'}
              </p>
            </div>
          </div>

          {favoritePlayers.length > 0 ? (
            <div className="favorites-grid player-grid">
              {favoritePlayers.map((player, index) => {
                console.log('🔍 Renderizando jugador:', player);
                return (
                  <Link to={`/players/${player.id}`} key={player.id || index} className="player-card favorite-item-card">
                    <div className="player-content">
                      <div className="player-photo-wrapper">
                        {player.photo_url ? (
                          <img
                            src={player.photo_url}
                            alt={player.full_name}
                            className="player-photo"
                            onError={(e) => {
                              console.error('❌ Error al cargar imagen:', player.photo_url);
                              // Si la imagen falla, usar avatar generado
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.full_name)}&size=120&background=064e3b&color=fff&bold=true&font-size=0.35`;
                            }}
                          />
                        ) : (
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(player.full_name)}&size=120&background=064e3b&color=fff&bold=true&font-size=0.35`}
                            alt={player.full_name}
                            className="player-photo"
                          />
                        )}
                      </div>
                      <div className="player-info">
                        <h3 className="player-name">{player.full_name}</h3>
                        <span className="player-position">{player.position}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zM8 10a4 4 0 118 0v1h-8v-1z" />
                </svg>
              </div>
              <p className="empty-title">No tenés jugadores favoritos aún</p>
              <p className="empty-subtitle">Empezá a seguir a tus estrellas favoritas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;