const express = require('express');
const router = express.Router();
const statscomptaController = require('../controllers/statscomptaController');

// Route pour récupérer les données du rapport
router.get('/statscompta', statscomptaController.getReportData);

module.exports = router;
