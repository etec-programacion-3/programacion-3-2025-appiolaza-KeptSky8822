// src/components/FavoritePlayerButton.jsx
import React, { useState, useEffect } from 'react';

const FavoritePlayerButton = ({ playerId, playerName, size = 'md', className = '' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromStorage());

  const sizes = {
    sm: '20px',
    md: '24px',
    lg: '32px',
  };

  useEffect(() => {
    const checkUser = () => {
      setUser(getUserFromStorage());
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  // Cargar el estado de favorito al montar o cuando el usuario/ID cambian
  useEffect(() => {
    if (user && playerId) {
      checkIfFavorite();
    } else {
      setIsFavorite(false);
    }
  }, [user, playerId]);

  const checkIfFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setIsFavorite(false);
        return;
    }

    try {
      // Endpoint para obtener la lista de favoritos del jugador
      const response = await fetch('http://localhost:3000/api/favorite-players', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const favorites = await response.json();
        
        console.log(`[DEBUG] Lista de Favoritos del Backend para jugador ${playerId}:`, favorites);
        
        const isFav =
          Array.isArray(favorites) &&
          favorites.some((fav) => {
              // *** CORRECCIÓN APLICADA AQUÍ ***
              // Comparamos el ID del jugador actual (playerId) con la propiedad 'id' 
              // del objeto devuelto por la API (fav.id), ya que ahí reside el ID del jugador.
              return String(fav.id) === String(playerId);
          });
          
        console.log(`[DEBUG] ¿El jugador ${playerId} es favorito? ${isFav}`);
        
        setIsFavorite(isFav);
      } else if (response.status === 401) {
        console.warn('Usuario no autorizado o token inválido');
        setIsFavorite(false);
      }
    } catch (error) {
      console.error('Error al verificar favoritos:', error);
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');

    if (!token) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        // --- Eliminar favorito ---
        const response = await fetch(
          `http://localhost:3000/api/favorite-players/${playerId}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          setIsFavorite(false);
        } else {
          throw new Error('Error al eliminar favorito'); 
        }
      } else {
        // --- Agregar favorito ---
        const response = await fetch('http://localhost:3000/api/favorite-players', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ playerId: parseInt(playerId) }), 
        });

        // Manejamos éxito (2xx) y duplicado (409 Conflict)
        if (response.ok || response.status === 409) { 
          setIsFavorite(true);
        } else {
          throw new Error(`Error ${response.status} al agregar favorito`);
        }
      }
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
      // Fallback para recargar el estado real
      checkIfFavorite(); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`favorite-button-wrapper ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`favorite-star-btn ${isFavorite ? 'favorite-active' : ''} ${
          loading ? 'favorite-loading' : ''
        }`}
        title={
          user
            ? isFavorite
              ? `Quitar a ${playerName} de favoritos`
              : `Agregar a ${playerName} a favoritos`
            : 'Inicia sesión para agregar favoritos'
        }
        style={{
          background: 'none',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          padding: '0.5rem',
          transition: 'all 0.3s ease',
          opacity: loading ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width={sizes[size]}
          height={sizes[size]}
          viewBox="0 0 24 24"
          fill={isFavorite ? '#fbbf24' : 'none'}
          stroke={isFavorite ? '#fbbf24' : '#9ca3af'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'all 0.3s ease',
            filter: isFavorite
              ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))'
              : 'none',
          }}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>

      {showLoginPrompt && (
        <div
          className="login-prompt-tooltip"
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '0.5rem',
            background: '#1f2937',
            color: 'white',
            fontSize: '0.75rem',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.75rem',
            whiteSpace: 'nowrap',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            animation: 'fadeInTooltip 0.3s ease-out',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '8px',
              height: '8px',
              background: '#1f2937',
            }}
          ></div>
          Inicia sesión para agregar favoritos
        </div>
      )}

      <style>{`
        .favorite-star-btn:not(:disabled):hover {
          transform: scale(1.15);
        }

        .favorite-star-btn:not(:disabled):hover svg {
          stroke: #fbbf24;
        }

        .favorite-star-btn:active {
          transform: scale(0.95);
        }

        @keyframes fadeInTooltip {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .favorite-loading {
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default FavoritePlayerButton;