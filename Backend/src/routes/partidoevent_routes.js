const express = require('express');
const router = express.Router();
const matchEventController = require('../controllers/partidoeventController');

// CRUD
router.get('/', matchEventController.getAll);
router.get('/:id', matchEventController.getById);
router.post('/', matchEventController.create);
router.put('/:id', matchEventController.update);
router.delete('/:id', matchEventController.delete);

module.exports = router;
