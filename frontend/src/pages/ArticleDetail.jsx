import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './ArticleDetail.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const res = await ApiService.getArticleById(id);
      setArticle(res);
    } catch (err) {
      console.error('Error al obtener artículo:', err);
      setError('No se pudo cargar el artículo');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/noticias');
  };

  if (loading) {
    return (
      <div className="article-detail-container">
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p className="loading-text">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-container">
        <div className="error-state">
          <div className="error-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <h2 className="error-title">Artículo no encontrado</h2>
          <p className="error-subtitle">El artículo que buscas no está disponible</p>
          <button onClick={handleBack} className="back-button">
            Volver a Noticias
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-container">
      <div className="article-detail-content">
        {/* Header con botón volver */}
        <div className="article-header">
          <button onClick={handleBack} className="back-btn">
            <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Noticias
          </button>
        </div>

        {/* Artículo completo */}
        <article className="article-full">
          {/* Imagen destacada */}
          {article.media && article.media.length > 0 && (
            <div className="article-hero-image">
              <img 
                src={article.media[0].url} 
                alt={article.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="hero-overlay"></div>
            </div>
          )}

          {/* Contenido del artículo */}
          <div className="article-body">
            <div className="article-meta">
              <span className="article-category">
                <svg className="category-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Noticias
              </span>
              <span className="article-date">
                <svg className="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                </svg>
                {new Date().toLocaleDateString('es-AR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>

            <h1 className="article-full-title">{article.title}</h1>

            <div className="article-full-content">
              {article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Galería de imágenes adicionales */}
            {article.media && article.media.length > 1 && (
              <div className="article-gallery">
                <h3 className="gallery-title">Más imágenes</h3>
                <div className="gallery-grid">
                  {article.media.slice(1).map((media, index) => (
                    <div key={index} className="gallery-item">
                      <img 
                        src={media.url} 
                        alt={`${article.title} - imagen ${index + 2}`}
                        onError={(e) => {
                          e.target.parentElement.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer con botón volver */}
            <div className="article-footer">
              <button onClick={handleBack} className="back-button">
                <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a Noticias
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;