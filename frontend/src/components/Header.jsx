import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Verificar si hay un usuario logueado al cargar el componente
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!token && !!user);
    };

    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length > 2) {
      try {
        console.log('🔍 Buscando:', query);
        
        // Buscar jugadores y equipos en paralelo
        const [playersResponse, teamsResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/players/search?q=${encodeURIComponent(query)}`),
          fetch(`http://localhost:3000/api/teams/search?q=${encodeURIComponent(query)}`)
        ]);

        console.log('Status jugadores:', playersResponse.status);
        console.log('Status equipos:', teamsResponse.status);

        const playersData = await playersResponse.json();
        const teamsData = await teamsResponse.json();

        console.log('📊 Datos recibidos:');
        console.log('Jugadores:', playersData);
        console.log('Equipos:', teamsData);

        const results = [];

        // PRIMERO: Agregar equipos
        // Verificar si es un array o un objeto único
        if (teamsData) {
          if (Array.isArray(teamsData) && teamsData.length > 0) {
            // Es un array de equipos
            teamsData.forEach(team => {
              results.push({
                type: 'team',
                name: team.name,
                logo_url: team.logo_url || team.logo,
                id: team.id
              });
            });
          } else if (teamsData.id && teamsData.name) {
            // Es un objeto único (un solo equipo)
            results.push({
              type: 'team',
              name: teamsData.name,
              logo_url: teamsData.logo_url || teamsData.logo,
              id: teamsData.id
            });
          }
          console.log('✅ Equipos agregados:', results.filter(r => r.type === 'team'));
        }

        // SEGUNDO: Agregar jugadores
        // Verificar si es un array o un objeto único
        if (playersData) {
          if (Array.isArray(playersData) && playersData.length > 0) {
            // Es un array de jugadores
            playersData.forEach(player => {
              results.push({
                type: 'player',
                name: `${player.first_name} ${player.last_name}`,
                team: player.Team?.name || 'Sin equipo',
                id: player.id
              });
            });
          } else if (playersData.id && playersData.first_name) {
            // Es un objeto único (un solo jugador)
            results.push({
              type: 'player',
              name: `${playersData.first_name} ${playersData.last_name}`,
              team: playersData.Team?.name || 'Sin equipo',
              id: playersData.id
            });
          }
          console.log('✅ Jugadores agregados:', results.filter(r => r.type === 'player'));
        }

        console.log('🎯 Total de resultados:', results.length);
        console.log('Resultados finales:', results);

        setSearchResults(results);

      } catch (error) {
        console.error('❌ Error al buscar:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'team': return '⚽';
      case 'player': return '👤';
      default: return '🔍';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleResultClick = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleLogin = () => {
    localStorage.setItem('authToken', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ username: 'Usuario', email: 'usuario@email.com' }));
    setIsLoggedIn(true);
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserMenuOpen(false);
    navigate('/');
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          ⚽ Football Vision
        </Link>
        
        <div className="search-container">
          <form onSubmit={handleSubmit} className="search-input-wrapper">
            <input
              type="text"
              placeholder="Buscar equipos y jugadores..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
              autoComplete="off"
            />
            <span className="search-icon">🔍</span>
          </form>

          {/* DEBUG: Mostrar estado */}
          {console.log('🐛 DEBUG - searchQuery.length:', searchQuery.length)}
          {console.log('🐛 DEBUG - searchResults.length:', searchResults.length)}
          {console.log('🐛 DEBUG - Condición cumplida?:', searchQuery.length > 2 && searchResults.length > 0)}
          
          {searchQuery.length > 2 && searchResults.length > 0 && (
            <div 
              className="search-results" 
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '2px solid red',
                borderRadius: '8px',
                marginTop: '8px',
                zIndex: 99999,
                maxHeight: '400px',
                overflowY: 'auto',
                display: 'block'
              }}
            >
              {console.log('🐛 RENDERIZANDO DROPDOWN CON', searchResults.length, 'RESULTADOS')}
              {searchResults.map((result, index) => {
                const linkPath = result.type === 'team' 
                  ? `/teams/${result.id}` 
                  : `/players/${result.id}`;
                
                return (
                  <Link
                    key={`${result.type}-${result.id}-${index}`}
                    to={linkPath}
                    className="search-result-item"
                    onClick={handleResultClick}
                  >
                    {result.type === 'team' && result.logo_url ? (
                      <img 
                        src={result.logo_url} 
                        alt={result.name}
                        className="result-team-logo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'inline';
                        }}
                      />
                    ) : null}
                    
                    <span 
                      className="result-icon" 
                      style={{ display: result.type === 'team' && result.logo_url ? 'none' : 'inline' }}
                    >
                      {getIcon(result.type)}
                    </span>
                    
                    <div className="result-info">
                      <span className="result-text">{result.name}</span>
                      {result.team && (
                        <span className="result-team-name">{result.team}</span>
                      )}
                    </div>
                    
                    <span className="result-type-badge">
                      {result.type === 'team' ? 'Equipo' : 'Jugador'}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              {isLoggedIn ? (
                <div className="user-menu-container">
                  <button
                    className="nav-link user-btn"
                    title="Usuario"
                    onClick={toggleUserMenu}
                  >
                    👤
                  </button>
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-info">
                        <span className="user-name">
                          {JSON.parse(localStorage.getItem('user') || '{}').username || 'Usuario'}
                        </span>
                      </div>
                      <button
                        className="logout-btn"
                        onClick={handleLogout}
                      >
                        🚪 Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="auth-btn login-btn">
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" className="auth-btn register-btn">
                    Registrarse
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;