import React from 'react';
import './Jugadores.css';

const Jugadores = () => {
  return (
    <div className="jugadores">
      <div className="page-header">
        <h1>Jugadores</h1>
        <p>Información sobre jugadores de fútbol</p>
      </div>

      <div className="content-placeholder">
        <div className="placeholder-icon">👥</div>
        <h2>Próximamente</h2>
        <p>Aquí podrás conocer las estadísticas, perfiles y rendimiento de los jugadores profesionales.</p>
      </div>
    </div>
  );
};

export default Jugadores;