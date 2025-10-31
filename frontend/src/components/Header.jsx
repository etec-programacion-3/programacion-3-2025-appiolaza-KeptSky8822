import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Cambiar a true para simular usuario logueado

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
                <button className="nav-link user-btn" title="Usuario">
                  👤
                </button>
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