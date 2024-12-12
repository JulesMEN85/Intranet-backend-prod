const MEN85CdeachatModel = require("../models/MEN85CdeachatModel");

exports.getCommandeAchat = async (request, response, next) => {
  try {
    let { from, to, nCommande, serie } = request.query;

    if (!from || !to) {
      return response.status(400).json({ error: "Les dates de début et de fin sont requises." });
    }

    const commandes = await MEN85CdeachatModel.getCdeAchat(from, to, nCommande, serie);

    if (!commandes || commandes.length === 0) {
      return response.status(404).json({ error: "Aucune commande trouvée pour les critères demandés." });
    }

    response.json(commandes);
  } catch (error) {
    console.trace(error);
    response.status(500).json({ error: `Erreur serveur, veuillez contacter un administrateur.` });
  }
};
