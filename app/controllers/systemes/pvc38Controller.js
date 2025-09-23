const { getPVC38Lines } = require("../../models/systemes/pvc38Model");

/**
 * Récupérer les lignes PVC38 entre deux dates
 */
const fetchPVC38Lines = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validation des dates
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Les dates de début et de fin sont requises." });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return res.status(400).json({ error: "Format de date invalide. Utilisez YYYY-MM-DD." });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: "La date de début doit être antérieure à la date de fin." });
    }

    // Récupération des données
    const pvc38Lines = await getPVC38Lines(startDate, endDate);
    res.status(200).json(pvc38Lines);
  } catch (error) {
    console.error("Erreur lors de la récupération des lignes PVC38 :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

module.exports = {
  fetchPVC38Lines
};
