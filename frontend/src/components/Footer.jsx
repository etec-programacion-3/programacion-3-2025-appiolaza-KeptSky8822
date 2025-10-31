import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Football Vision</h3>
            <p>Tu aplicación completa para seguir el fútbol.</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul className="footer-links">
              <li><a href="#about">Sobre nosotros</a></li>
              <li><a href="#contact">Contacto</a></li>
              <li><a href="#support">Soporte</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Política de Privacidad</a></li>
              <li><a href="#terms">Términos de Servicio</a></li>
              <li><a href="#cookies">Política de Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Football Vision. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;