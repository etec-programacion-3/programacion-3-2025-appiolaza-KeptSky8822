const { Article, MediaGallery } = require('../models');

// Obtener todos los artículos con sus medios
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: { model: MediaGallery, as: 'media' }
    });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener artículo por id
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: { model: MediaGallery, as: 'media' }
    });
    if (!article) return res.status(404).json({ message: 'Artículo no encontrado' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear artículo
exports.createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newArticle = await Article.create({ title, content });
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar artículo
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ message: 'Artículo no encontrado' });

    const { title, content } = req.body;
    await article.update({ title, content });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar artículo
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ message: 'Artículo no encontrado' });

    await article.destroy();
    res.json({ message: 'Artículo eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
