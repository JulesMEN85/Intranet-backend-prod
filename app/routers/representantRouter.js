const express = require('express');
const { fetchRepresentants, fetchClientsByRepresentant } = require('../controllers/representantController');

const router = express.Router();

// Route pour récupérer tous les représentants
router.get('/', fetchRepresentants);

// Route pour récupérer les clients associés à un représentant
router.get('/clients', fetchClientsByRepresentant);

module.exports = router;
