import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Verificar si hay un usuario logueado al cargar el componente
  useEffect(() => {
    const checkLoginStatus = () => {
      // Aquí puedes verificar si hay un token en localStorage o sessionStorage
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!token && !!user);
    };

    checkLoginStatus();

    // Escuchar cambios en localStorage (para cuando se hace login desde otras páginas)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Simular búsqueda - aquí se conectaría con la API
      const mockResults = [
        { type: 'competition', name: 'Premier League', id: 1 },
        { type: 'team', name: 'Manchester City', id: 2 },
        { type: 'player', name: 'Lionel Messi', id: 3 },
        { type: 'competition', name: 'La Liga', id: 4 },
        { type: 'team', name: 'Barcelona', id: 5 },
      ].filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(mockResults);
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'competition': return '🏆';
      case 'team': return '⚽';
      case 'player': return '👤';
      default: return '🔍';
    }
  };

  const handleLogin = () => {
    // Simular login exitoso (aquí iría la lógica real de autenticación)
    localStorage.setItem('authToken', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ username: 'Usuario', email: 'usuario@email.com' }));
    setIsLoggedIn(true);
    // Forzar re-render del header
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
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Buscar competiciones, equipos, jugadores..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          {isSearching && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result, index) => (
                <div key={index} className="search-result-item">
                  <span className="result-icon">{getIcon(result.type)}</span>
                  <span className="result-text">{result.name}</span>
                  <span className="result-type">{result.type}</span>
                </div>
              ))}
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