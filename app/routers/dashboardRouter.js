const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');

// middleware pour contrôler le token
const { authenticateToken } = require('../middlewares/members');

router.use(authenticateToken);

// affiche les données par année
router.get('/getData/:year/:entreprise', dashboardController.showDataByYear);

// affiche les années disponibles
router.get('/years/allYears/:entreprise', dashboardController.showAllYears);

// Routes supplémentaires pour les données spécifiques `BL` et `Facture`
router.get('/getBLData/:year/:entreprise', dashboardController.getBLDataByYear);

router.get('/getFactureData/:year/:entreprise', dashboardController.getFactureDataByYear); // Nouvelle route pour FACT HT

module.exports = router;
