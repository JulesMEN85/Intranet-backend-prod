const express = require('express');
const router = express.Router();
const CdeachatController = require('../controllers/CdeachatController');

// Route pour récupérer les commandes d'achat entre deux dates
router.get('/achat', CdeachatController.getCommandeAchat);

// Route pour mettre à jour les articles dans une commande d'achat
// router.put('/commande/update', CdeachatController.updateArticleInCommandeCdeAchat);

module.exports = router;
