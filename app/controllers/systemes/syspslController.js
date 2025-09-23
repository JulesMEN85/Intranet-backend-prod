const { getPSProducts } = require("../../models/systemes/syspslModel");

/**
 * Récupérer les produits PSL et PSPP entre deux dates.
 */
const fetchPSLProducts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Les dates de début et de fin sont requises." });
    }

    // Vérifiez que les dates sont au bon format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return res.status(400).json({ error: "Format de date invalide. Utilisez YYYY-MM-DD." });
    }

    // Vérifiez que startDate est antérieure à endDate
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: "La date de début doit être antérieure à la date de fin." });
    }

    const pslProducts = await getPSProducts(startDate, endDate);
    res.status(200).json(pslProducts);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits PSL :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

module.exports = {
  fetchPSLProducts
};
