import React from 'react';
import './Partidos.css';

const Partidos = () => {
  return (
    <div className="partidos">
      <div className="page-header">
        <h1>Partidos</h1>
        <p>Resultados y próximos partidos de fútbol</p>
      </div>

      <div className="content-placeholder">
        <div className="placeholder-icon">📅</div>
        <h2>Próximamente</h2>
        <p>Aquí podrás seguir los resultados en vivo, próximos encuentros y calendario de competiciones.</p>
      </div>
    </div>
  );
};

export default Partidos;