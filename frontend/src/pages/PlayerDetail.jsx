import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PlayerDetail.css';

const PlayerDetail = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [playerPhoto, setPlayerPhoto] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/players/${id}`)
      .then(res => res.json())
      .then(data => {
        setPlayer(data);
        // Intentar buscar foto real del jugador
        searchPlayerPhoto(data);
      })
      .catch(error => console.error('Error al cargar jugador:', error));
  }, [id]);

  // Función para buscar foto del jugador en APIs externas
  const searchPlayerPhoto = async (playerData) => {
    const fullName = `${playerData.first_name} ${playerData.last_name}`;
    
    try {
      // Intentar con TheSportsDB API (gratis, tiene muchos jugadores)
      const searchName = encodeURIComponent(fullName);
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${searchName}`);
      const data = await response.json();
      
      if (data.player && data.player.length > 0) {
        const playerImg = data.player[0].strThumb || data.player[0].strCutout;
        if (playerImg) {
          setPlayerPhoto(playerImg);
          return;
        }
      }
    } catch (error) {
      console.log('No se encontró foto en TheSportsDB');
    }

    // Si no se encuentra, usar avatar por defecto
    setPlayerPhoto(`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=300&background=667eea&color=fff&bold=true&font-size=0.35&rounded=true`);
  };

  if (!player) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando jugador...</p>
      </div>
    );
  }

  // 🗓️ Convertir fecha y calcular edad
  const birthday = player.date_of_birth ? new Date(player.date_of_birth) : null;
  const formattedBirthday = birthday
    ? birthday.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Fecha desconocida';

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(birthday);

  // 🌍 Traducciones y banderas
  const countries = {
    Argentina: { name: 'Argentina', code: 'ar' },
    Spain: { name: 'España', code: 'es' },
    Brazil: { name: 'Brasil', code: 'br' },
    France: { name: 'Francia', code: 'fr' },
    Germany: { name: 'Alemania', code: 'de' },
    Italy: { name: 'Italia', code: 'it' },
    England: { name: 'Inglaterra', code: 'gb' },
    Portugal: { name: 'Portugal', code: 'pt' },
    Uruguay: { name: 'Uruguay', code: 'uy' },
    Chile: { name: 'Chile', code: 'cl' },
  };

  const nationalityData = countries[player.nationality] || {
    name: player.nationality || 'Desconocida',
    code: null,
  };

  // Obtener foto del jugador
  const getPlayerPhoto = () => {
    // Si ya buscamos una foto, usarla
    if (playerPhoto) return playerPhoto;
    
    // Si tiene foto en BD, usarla
    if (player.photo_url) return player.photo_url;
    
    // Mientras se busca, mostrar avatar
    const fullName = `${player.first_name} ${player.last_name}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=300&background=667eea&color=fff&bold=true&font-size=0.35&rounded=true`;
  };

  return (
    <div className="player-detail-container">
      <div className="player-detail-wrapper">
        
        {/* Card Principal */}
        <div className="player-card">
          
          {/* Banner Superior con Gradiente */}
          <div className="player-banner">
            <div className="banner-overlay"></div>
          </div>
          
          {/* Sección de Foto */}
          <div className="player-photo-section">
            <div className="photo-wrapper">
              <img
                className="player-photo"
                src={getPlayerPhoto()}
                alt={`${player.first_name} ${player.last_name}`}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    player.first_name + ' ' + player.last_name
                  )}&size=300&background=2563eb&color=fff&bold=true`;
                }}
              />
              
              {/* Badge del equipo en la foto */}
              {player.Team?.logo_url && (
                <div className="team-badge">
                  <img
                    src={player.Team.logo_url}
                    alt={player.Team.name}
                    className="team-logo-small"
                  />
                </div>
              )}
            </div>
            
            {/* Nombre del jugador */}
            <h1 className="player-name">
              {player.first_name} <span className="last-name">{player.last_name}</span>
            </h1>
            
            {/* Posición */}
            <div className="position-badge">
              {player.position || 'Posición desconocida'}
            </div>
          </div>
        </div>

        {/* Grid de Información */}
        <div className="info-grid">
          
          {/* Tarjeta Equipo */}
          <div className="info-card team-card">
            <div className="card-icon">
              {player.Team?.logo_url ? (
                <img
                  src={player.Team.logo_url}
                  alt={player.Team.name}
                  className="team-logo-icon"
                />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
            </div>
            <div className="card-content">
              <p className="card-label">Equipo</p>
              <p className="card-value">{player.Team?.name || 'Sin equipo'}</p>
            </div>
          </div>

          {/* Tarjeta Nacionalidad */}
          <div className="info-card nationality-card">
            <div className="card-icon">
              {nationalityData.code ? (
                <img
                  src={`https://flagcdn.com/w40/${nationalityData.code}.png`}
                  alt={nationalityData.name}
                  className="flag-icon"
                />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              )}
            </div>
            <div className="card-content">
              <p className="card-label">Nacionalidad</p>
              <p className="card-value">{nationalityData.name}</p>
            </div>
          </div>

          {/* Tarjeta Cumpleaños */}
          <div className="info-card birthday-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="card-content">
              <p className="card-label">Cumpleaños</p>
              <p className="card-value">{formattedBirthday}</p>
            </div>
          </div>

          {/* Tarjeta Edad */}
          <div className="info-card age-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="card-content">
              <p className="card-label">Edad</p>
              <p className="card-value">{age ? `${age} años` : 'Desconocida'}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlayerDetail;