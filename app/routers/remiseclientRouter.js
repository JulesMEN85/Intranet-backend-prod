const express = require('express');
const remiseclientController = require('../controllers/remiseclientController'); // Vérifiez le chemin ici

const router = express.Router();

router.get('/', remiseclientController.fetchClientRemises);
router.get('/total-clients', remiseclientController.getTotalClients);
router.get('/total-particuliers', remiseclientController.getTotalParticuliers);

module.exports = router;
