const express = require('express');
const { fetchPanelQuantity } = require('../controllers/QuantiteAchatController');

const router = express.Router();

// Route pour récupérer les Quantités de Panneaux
router.get('/quantity', fetchPanelQuantity);

module.exports = router;
