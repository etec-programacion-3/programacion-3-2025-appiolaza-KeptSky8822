import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import './TeamDetail.css';

const TeamDetail = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerPhotos, setPlayerPhotos] = useState({});

  // Función para buscar foto del jugador en Wikipedia
  const searchPlayerPhoto = async (playerName, playerId) => {
    try {
      // Buscar en Wikipedia
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(playerName + ' footballer')}&gsrlimit=1&prop=pageimages&pithumbsize=300`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.query && data.query.pages) {
        const pages = Object.values(data.query.pages);
        if (pages[0]?.thumbnail?.source) {
          setPlayerPhotos(prev => ({
            ...prev,
            [playerId]: pages[0].thumbnail.source
          }));
          return pages[0].thumbnail.source;
        }
      }
    } catch (error) {
      console.log(`No se encontró foto para ${playerName}`);
    }
    return null;
  };

  useEffect(() => {
    const fetchTeamAndPlayers = async () => {
      try {
        console.log('Cargando equipo con ID:', id);
        
        // Fetch team data
        const teamResponse = await fetch(`http://localhost:3000/api/teams/${id}`);
        if (!teamResponse.ok) {
          throw new Error("Error al obtener los datos del equipo");
        }
        const teamData = await teamResponse.json();
        console.log('===== DEBUG FRONTEND =====');
        console.log('Datos completos del equipo:', teamData);
        console.log('¿Tiene Players?', teamData.Players ? 'SÍ' : 'NO');
        console.log('Cantidad de jugadores:', teamData.Players ? teamData.Players.length : 0);
        console.log('Jugadores:', teamData.Players);
        console.log('========================');
        
        setTeam(teamData);

        // Extraer jugadores del equipo si vienen incluidos
        if (teamData.Players && Array.isArray(teamData.Players)) {
          console.log('Seteando jugadores desde teamData.Players');
          setPlayers(teamData.Players);
          
          // Buscar fotos para cada jugador
          teamData.Players.forEach(player => {
            const fullName = `${player.first_name} ${player.last_name}`;
            searchPlayerPhoto(fullName, player.id);
          });
        } else {
          console.log('No hay jugadores en teamData.Players');
          setPlayers([]);
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamAndPlayers();
  }, [id]);

  if (loading) {
    return (
      <div className="team-detail-page">
        <div className="team-loading">
          <div className="team-spinner"></div>
          <p>Cargando información del equipo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="team-detail-page">
        <div className="team-error">
          <span className="team-error-icon">⚠️</span>
          <h2>Error al cargar el equipo</h2>
          <p>{error}</p>
          <Link to="/" className="team-back-btn">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="team-detail-page">
        <div className="team-error">
          <span className="team-error-icon">🔍</span>
          <h2>Equipo no encontrado</h2>
          <Link to="/" className="team-back-btn">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="team-detail-page">
      {/* Header principal del equipo */}
      <div className="team-main-card">
        <div className="team-logo-section">
          <img
            src={team.logo_url || team.logo || "https://via.placeholder.com/200?text=Logo"}
            alt={team.name}
            className="team-main-logo"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/200?text=Logo";
            }}
          />
        </div>
        
        <h1 className="team-main-name">{team.name}</h1>
        
        {team.short_name && (
          <p className="team-short-name">{team.short_name}</p>
        )}
        
        {team.code && (
          <span className="team-code-badge">{team.code}</span>
        )}
      </div>

      {/* Grid de información */}
      <div className="team-info-grid">
        {/* País */}
        {team.country && (
          <div className="team-info-card">
            <div className="team-info-icon">🌍</div>
            <div className="team-info-content">
              <span className="team-info-label">PAÍS</span>
              <span className="team-info-value">{team.country}</span>
            </div>
          </div>
        )}

        {/* Ciudad */}
        {team.city && (
          <div className="team-info-card">
            <div className="team-info-icon">🏙️</div>
            <div className="team-info-content">
              <span className="team-info-label">CIUDAD</span>
              <span className="team-info-value">{team.city}</span>
            </div>
          </div>
        )}

        {/* Estadio */}
        {team.stadium && (
          <div className="team-info-card">
            <div className="team-info-icon">🏟️</div>
            <div className="team-info-content">
              <span className="team-info-label">ESTADIO</span>
              <span className="team-info-value">{team.stadium}</span>
            </div>
          </div>
        )}

        {/* Capacidad */}
        {team.stadium_capacity && (
          <div className="team-info-card">
            <div className="team-info-icon">👥</div>
            <div className="team-info-content">
              <span className="team-info-label">CAPACIDAD</span>
              <span className="team-info-value">{team.stadium_capacity.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Fundación */}
        {team.founded && (
          <div className="team-info-card">
            <div className="team-info-icon">📅</div>
            <div className="team-info-content">
              <span className="team-info-label">FUNDACIÓN</span>
              <span className="team-info-value">{team.founded}</span>
            </div>
          </div>
        )}

        {/* Website */}
        {team.website && (
          <div className="team-info-card">
            <div className="team-info-icon">🌐</div>
            <div className="team-info-content">
              <span className="team-info-label">SITIO WEB</span>
              <a 
                href={team.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="team-info-link"
              >
                Visitar
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Sección de plantilla */}
      <div className="team-squad-section">
        <h2 className="team-section-title">
          Plantilla
          {players.length > 0 && (
            <span className="team-squad-count">
              {players.length} jugador{players.length !== 1 ? 'es' : ''}
            </span>
          )}
        </h2>

        {players.length > 0 ? (
          <div className="team-players-grid">
            {players.map((player) => {
              // Generar avatar con iniciales como fallback
              const firstName = player.first_name || '';
              const lastName = player.last_name || '';
              const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}&size=200&background=10b981&color=ffffff&bold=true&font-size=0.4`;
              
              // Usar foto de Wikipedia si está disponible, sino usar avatar
              const photoUrl = playerPhotos[player.id] || avatarUrl;
              
              return (
                <Link
                  key={player.id}
                  to={`/players/${player.id}`}
                  className="team-player-card"
                >
                  <div className="team-player-photo-wrapper">
                    <img
                      src={photoUrl}
                      alt={`${firstName} ${lastName}`}
                      className="team-player-photo"
                      onError={(e) => {
                        // Si falla la foto de Wikipedia, usar el avatar
                        e.target.src = avatarUrl;
                      }}
                    />
                    {player.jersey_number && (
                      <span className="team-player-number">#{player.jersey_number}</span>
                    )}
                  </div>
                  
                  <div className="team-player-info">
                    <h3 className="team-player-name">
                      {firstName} {lastName}
                    </h3>
                    {player.position && (
                      <span className="team-player-position">{player.position}</span>
                    )}
                    {player.nationality && (
                      <span className="team-player-nationality">{player.nationality}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="team-no-players">
            <span className="team-no-players-icon">⚽</span>
            <p>No hay jugadores registrados en este equipo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetail;