const MEN85CdeachatModel = require('../models/MEN85CdeachatModel');

// ✅ Fonction existante
exports.getCommandeAchat = async (req, res) => {
  try {
    const { from, to, nCommande, serie } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: "Les dates de début et de fin sont requises." });
    }

    const commandes = await MEN85CdeachatModel.getCdeAchat(from, to, nCommande, serie);

    if (!commandes || commandes.length === 0) {
      return res.status(404).json({ error: "Aucune commande trouvée." });
    }

    res.status(200).json(commandes);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur, veuillez contacter un administrateur." });
  }
};

// 🎯 Récupérer les articles avec la quantité reçue
exports.getArticlesByCommande = async (req, res) => {
  try {
    const { numero } = req.params;

    if (!numero) {
      return res.status(400).json({ error: "Le numéro de commande est requis." });
    }

    const articles = await MEN85CdeachatModel.getArticlesByCommande(numero);

    if (!articles || articles.length === 0) {
      return res.status(404).json({ error: "Aucun article trouvé pour cette commande." });
    }

    res.status(200).json(articles);
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    res.status(500).json({ error: "Erreur serveur, veuillez contacter un administrateur." });
  }
};
