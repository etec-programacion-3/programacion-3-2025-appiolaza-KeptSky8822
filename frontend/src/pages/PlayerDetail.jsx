import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../services/api';
import FavoritePlayerButton from './FavoritePlayerButton';
import './PlayerDetail.css';

const PlayerDetail = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [playerPhoto, setPlayerPhoto] = useState(null);

  useEffect(() => {
    loadPlayer();
  }, [id]);

  const loadPlayer = async () => {
    try {
      const data = await ApiService.getPlayerById(id);
      setPlayer(data);
      searchPlayerPhoto(data);
    } catch (error) {
      console.error('Error al cargar jugador:', error);
    }
  };

  const searchPlayerPhoto = async (playerData) => {
    const fullName = `${playerData.first_name} ${playerData.last_name}`;
    
    try {
      const searchName = encodeURIComponent(fullName);
      // Usando '3' para la versión pública de la API de TheSportsDB, asumiendo que funciona
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${searchName}`);
      const data = await response.json();
      
      if (data.player && data.player.length > 0) {
        // Preferir strCutout (silueta) sobre strThumb (cuerpo completo/tarjeta) si están disponibles
        const playerImg = data.player[0].strCutout || data.player[0].strThumb; 
        if (playerImg) {
          setPlayerPhoto(playerImg);
          return;
        }
      }
    } catch (error) {
      console.log('No se encontró foto en TheSportsDB', error);
    }

    // Fallback con ui-avatars
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
    // Puedes agregar más países aquí
  };

  const nationalityData = countries[player.nationality] || {
    name: player.nationality || 'Desconocida',
    code: null,
  };

  const getPlayerPhoto = () => {
    // Si ya cargó la foto de TheSportsDB o el avatar, usa playerPhoto
    if (playerPhoto) return playerPhoto; 
    // Fallback: si el backend tiene una URL directa
    if (player.photo_url) return player.photo_url;
    // Fallback final: avatar generado
    const fullName = `${player.first_name} ${player.last_name}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=300&background=667eea&color=fff&bold=true&font-size=0.35&rounded=true`;
  };

  return (
    <div className="player-detail-container">
      <div className="player-detail-wrapper">
        <div className="player-card">
          <div className="player-banner">
            <div className="banner-overlay"></div>
            
            {/* Botón de favorito */}
            <div className="favorite-btn-container">
              <FavoritePlayerButton 
                playerId={id}
                playerName={`${player.first_name} ${player.last_name}`}
                size="lg"
              />
            </div>
          </div>
          
          <div className="player-photo-section">
            <div className="photo-wrapper">
              <img
                className="player-photo"
                src={getPlayerPhoto()}
                alt={`${player.first_name} ${player.last_name}`}
              />
              
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
            
            <h1 className="player-name">
              {player.first_name} <span className="last-name">{player.last_name}</span>
            </h1>
            
            <div className="position-badge">
              {player.position || 'Posición desconocida'}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="info-grid">
          
          {/* Equipo */}
          <div className="info-card team-card">
            <div className="card-icon">
              {player.Team?.logo_url ? (
                <img src={player.Team.logo_url} alt={player.Team.name} className="team-logo-icon" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
            </div>
            <div className="card-content">
              <p className="card-label">Equipo</p>
              <p className="card-value">{player.Team?.name || 'Sin equipo'}</p>
            </div>
          </div>

          {/* Nacionalidad */}
          <div className="info-card nationality-card">
            <div className="card-icon">
              {nationalityData.code ? (
                <img src={`https://flagcdn.com/w40/${nationalityData.code}.png`} alt={nationalityData.name} className="flag-icon" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="card-content">
              <p className="card-label">Nacionalidad</p>
              <p className="card-value">{nationalityData.name}</p>
            </div>
          </div>

          {/* Cumpleaños */}
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
          
          {/* Edad */}
          <div className="info-card age-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v5h.582m15.356 2A8.96 8.96 0 0020 12c0-4.97-4.43-9-9.928-9C6.884 3 4 5.257 4 9s2.884 6 6.072 6c1.192 0 2.373-.243 3.49-1m-4.072-5V9H16.5" />
              </svg>
            </div>
            <div className="card-content">
              <p className="card-label">Edad</p>
              <p className="card-value">{age ? `${age} años` : 'Desconocida'}</p>
            </div>
          </div>
        </div> {/* Cierre de info-grid */}
      </div> {/* Cierre de player-detail-wrapper */}
    </div> // Cierre de player-detail-container
  );
};

export default PlayerDetail;