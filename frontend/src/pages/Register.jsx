import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar mensajes cuando el usuario empiece a escribir
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validaciones del lado cliente
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Preparar datos para la API (excluir confirmPassword)
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      // Llamar a la API para crear usuario
      const response = await apiService.createUser(userData);

      setSuccess('Cuenta creada exitosamente! Redirigiendo al login...');
      console.log('Usuario creado:', response);

      // Limpiar el formulario
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError('Error al crear la cuenta: ' + (err.message || 'Inténtalo de nuevo'));
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Crear Cuenta</h1>
          <p>Únete a la comunidad de Football Vision</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
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

          {success && (
            <div className="success-message" style={{
              color: '#155724',
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Tu nombre de usuario"
            />
          </div>

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
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirma tu contraseña"
              minLength="6"
            />
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Creando Cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="register-footer">
          <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;