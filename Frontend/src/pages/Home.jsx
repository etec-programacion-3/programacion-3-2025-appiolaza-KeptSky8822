const Home = () => {
  return (
    <div className="page-container">
      <h1>Bienvenido a Fútbol App</h1>
      <p>Tu aplicación completa para seguir el fútbol.</p>
      <div className="home-content">
        <div className="feature-card">
          <h2>Equipos</h2>
          <p>Explora información detallada sobre tus equipos favoritos.</p>
        </div>
        <div className="feature-card">
          <h2>Jugadores</h2>
          <p>Conoce las estadísticas y perfiles de los jugadores.</p>
        </div>
        <div className="feature-card">
          <h2>Partidos</h2>
          <p>Sigue los resultados y próximos encuentros.</p>
        </div>
        <div className="feature-card">
          <h2>Estadísticas</h2>
          <p>Analiza datos y métricas del fútbol.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;