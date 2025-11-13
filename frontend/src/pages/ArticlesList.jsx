import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import './ArticlesList.css';

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await ApiService.getArticles();
      const shuffled = res.sort(() => Math.random() - 0.5);
      setArticles(shuffled);
    } catch (err) {
      console.error('Error al obtener artículos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="articles-container">
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p className="loading-text">Cargando noticias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="articles-container">
      <div className="articles-header">
        <div className="header-content">
          <div className="icon-wrapper">
            <span className="news-icon">📰</span>
          </div>
          <div>
            <h1 className="articles-title">Últimas Noticias</h1>
            <p className="articles-subtitle">
              {articles.length} {articles.length === 1 ? 'artículo' : 'artículos'} disponibles
            </p>
          </div>
        </div>
      </div>

      <div className="articles-list">
        {articles.map(article => (
          <article 
            key={article.id} 
            className="article-card"
          >
            {article.media && article.media.length > 0 && (
              <div className="article-image-wrapper">
                <img 
                  src={article.media[0].url} 
                  alt={article.title}
                  className="article-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.display = 'none';
                  }}
                />
                <div className="image-overlay"></div>
              </div>
            )}
            
            <div className="article-content">
              <h3 className="article-title">{article.title}</h3>
              <p className="article-excerpt">
                {article.content.substring(0, 150)}...
              </p>
              
              <div className="article-footer">
                <button 
                  className="read-more-btn"
                  onClick={() => navigate(`/noticias/${article.id}`)}
                >
                  Leer más
                  <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
          </div>
          <h3 className="empty-title">No hay artículos disponibles</h3>
          <p className="empty-subtitle">Vuelve más tarde para ver las últimas noticias</p>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;