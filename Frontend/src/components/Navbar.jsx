import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Fútbol App
        </Link>
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={toggleMenu}>
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/equipos" className="nav-links" onClick={toggleMenu}>
              Equipos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/jugadores" className="nav-links" onClick={toggleMenu}>
              Jugadores
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/partidos" className="nav-links" onClick={toggleMenu}>
              Partidos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/estadisticas" className="nav-links" onClick={toggleMenu}>
              Estadísticas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;