const express = require('express');
const router = express.Router();
const CdeachatController = require('../controllers/CdeachatController');  // Vérifie ce chemin

// ✅ Route existante
router.get('/achat', CdeachatController.getCommandeAchat);

// ✅ Nouvelle route pour récupérer les articles d'une commande
router.get('/articles/:numero', CdeachatController.getArticlesByCommande);

module.exports = router;
