import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './Jugadores.css';

const Jugadores = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const data = await apiService.getPlayers();
        setPlayers(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los jugadores');
        console.error('Error fetching players:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="jugadores">
        <div className="page-header">
          <h1>Jugadores</h1>
          <p>Información sobre jugadores de fútbol</p>
        </div>
        <div className="loading">
          <p>Cargando jugadores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jugadores">
        <div className="page-header">
          <h1>Jugadores</h1>
          <p>Información sobre jugadores de fútbol</p>
        </div>
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jugadores">
      <div className="page-header">
        <h1>Jugadores</h1>
        <p>Información sobre jugadores de fútbol</p>
      </div>

      <div className="players-grid">
        {players.length > 0 ? (
          players.map((player) => (
            <div key={player.id} className="player-card">
              <div className="player-header">
                <h3 className="player-name">{player.name}</h3>
                <span className="player-position">{player.position || 'Jugador'}</span>
              </div>
              <div className="player-info">
                <p><strong>Edad:</strong> {player.age || 'N/A'}</p>
                <p><strong>Nacionalidad:</strong> {player.nationality || 'N/A'}</p>
                <p><strong>Equipo:</strong> {player.team_name || 'N/A'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="content-placeholder">
            <div className="placeholder-icon">👥</div>
            <h2>No hay jugadores disponibles</h2>
            <p>No se encontraron jugadores en la base de datos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jugadores;