import React from 'react';
import './Estadisticas.css';

const Estadisticas = () => {
  return (
    <div className="estadisticas">
      <div className="page-header">
        <h1>Estadísticas</h1>
        <p>Datos y métricas del fútbol</p>
      </div>

      <div className="content-placeholder">
        <div className="placeholder-icon">📊</div>
        <h2>Próximamente</h2>
        <p>Aquí podrás analizar datos detallados, clasificaciones y métricas del mundo del fútbol.</p>
      </div>
    </div>
  );
};

export default Estadisticas;