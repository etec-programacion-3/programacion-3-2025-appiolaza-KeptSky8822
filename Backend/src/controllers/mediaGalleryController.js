const { MediaGallery, Article } = require('../models');

// Obtener todos los medios
exports.getAllMedia = async (req, res) => {
  try {
    const media = await MediaGallery.findAll({
      include: { model: Article, as: 'article' }
    });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener medio por id
exports.getMediaById = async (req, res) => {
  try {
    const media = await MediaGallery.findByPk(req.params.id, {
      include: { model: Article, as: 'article' }
    });
    if (!media) return res.status(404).json({ message: 'Medio no encontrado' });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear medio
exports.createMedia = async (req, res) => {
  try {
    const { type, url, article_id } = req.body;
    const newMedia = await MediaGallery.create({ type, url, article_id });
    res.status(201).json(newMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar medio
exports.updateMedia = async (req, res) => {
  try {
    const media = await MediaGallery.findByPk(req.params.id);
    if (!media) return res.status(404).json({ message: 'Medio no encontrado' });

    const { type, url } = req.body;
    await media.update({ type, url });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar medio
exports.deleteMedia = async (req, res) => {
  try {
    const media = await MediaGallery.findByPk(req.params.id);
    if (!media) return res.status(404).json({ message: 'Medio no encontrado' });

    await media.destroy();
    res.json({ message: 'Medio eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
