const pspModel = require("../../models/systemes/pspModel");

const getPSPData = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Les dates sont obligatoires." });
  }

  try {
    const data = await pspModel.getPSPProducts(startDate, endDate);
    res.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données PSP :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des données." });
  }
};

const getPostesPersonnel = async (req, res) => {
  console.log("📥 Requête reçue avec query params :", req.query); // 🔥 Debug

  const { selectedWeek } = req.query;

  if (!selectedWeek) {
    console.error("❌ Erreur : `selectedWeek` est manquant !");
    return res.status(400).json({ error: "La semaine sélectionnée est obligatoire." });
  }

  try {
    const data = await pspModel.getPostesPersonnel(selectedWeek);
    console.log("✅ Données des postes personnel récupérées :", JSON.stringify(data, null, 2));

    if (data.length === 0) {
      return res.status(200).json({ message: "AUCUNE ASSIGNATION" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Erreur dans le contrôleur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};







module.exports = { getPSPData, getPostesPersonnel };
