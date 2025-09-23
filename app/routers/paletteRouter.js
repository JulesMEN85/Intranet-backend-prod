const express = require('express');
const { fetchCommandes } = require('../controllers/paletteController');

const router = express.Router();

// Route pour récupérer les palettes
router.get('/palette', fetchCommandes);

module.exports = router;
