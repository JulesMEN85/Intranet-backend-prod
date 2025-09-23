const express = require('express');
const router = express.Router();
const TdcController = require('../controllers/tdcController');

// Route pour récupérer le taux de charge
router.get('/taux-de-charge', TdcController.getTauxDeCharge);

// Route pour récupérer le personnel d'une semaine spécifique
router.get('/weekly-personnel', TdcController.getWeeklyPersonnel);

// Route pour assigner un poste à une personne dans une semaine précise
router.put("/assign-poste-week", TdcController.assignPosteForWeek);

//Route pour récupéré tout les postes unique 
router.get("/unique-postes", TdcController.getUniquePostes);

router.get("/unique-personnel", TdcController.getUniquePersonnel);

module.exports = router;
