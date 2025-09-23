const express = require('express');
const { 
  fetchEncodeurs, 
  fetchProcessingTimeByEncodeur, 
  fetchProcessingTime, 
  fetchProcessingTimeForCCommands,
  fetchProcessingTimeForSAVCommands, 
  fetchProcessingTimeForAccess, 
  fetchComparisonForMonths
} = require('../controllers/encodeurController');

const router = express.Router();

// Route pour récupérer la liste des encodeurs
router.get('/list', fetchEncodeurs);

// Route pour récupérer les temps de traitement par encodeur
router.get('/processing-time', fetchProcessingTimeByEncodeur);

// Nouvelle route pour récupérer les temps de traitement sans filtre sur l'encodeur
router.get('/weekly-processing-time', fetchProcessingTime);

router.get('/c-commands-processing-time', fetchProcessingTimeForCCommands);

router.get('/sav-commands-processing-time', fetchProcessingTimeForSAVCommands);

router.get('/access-commands-processing-time', fetchProcessingTimeForAccess);

router.get('/compare-months', fetchComparisonForMonths);

module.exports = router;
