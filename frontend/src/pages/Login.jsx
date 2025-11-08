import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Iniciando sesión con:', formData);

      // Llamada real a tu backend
      const response = await apiService.login(formData);

      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Notificar al header que cambió el estado de sesión
      window.dispatchEvent(new Event('storage'));

      // Redirigir al inicio después de 1 segundo
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (err) {
      console.error('Error en login:', err);
      setError(('Usuario o contraseña incorrectos. Inténtalo nuevamente.'));
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Iniciar Sesión</h1>
          <p>Bienvenido de vuelta a Football Vision</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Tu contraseña"
            />
          </div>

          {error && (
            <div className="error-message" style={{
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;