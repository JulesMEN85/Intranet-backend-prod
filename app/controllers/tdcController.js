const TdcModel = require('../models/tdcModel');

exports.getTauxDeCharge = async (req, res) => {
    const { week } = req.query;

    if (!week) {
        return res.status(400).json({ message: "La semaine est requise." });
    }

    try {
        const results = await TdcModel.calculateTauxDeCharge(week);
        res.status(200).json(results);
    } catch (error) {
        console.error("Erreur lors de la récupération du taux de charge :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};


exports.getWeeklyPersonnel = async (req, res) => {
    try {
        const personnel = await TdcModel.getWeeklyPersonnel(req.query.week);

        console.log("📤 Données renvoyées au frontend :", personnel); // 🔍 Vérification

        res.json(personnel);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du personnel :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


exports.assignPosteForWeek = async (req, res) => {
    const { id, poste, semaine } = req.body; // Récupère les données envoyées par le front

    console.log("📩 Données reçues dans le backend :", { id, poste, semaine });

    if (!id || !poste || !semaine) {
      return res.status(400).json({ message: "ID, poste et semaine sont requis." });
    }

    try {
      const result = await TdcModel.assignPosteForWeek(id, poste, semaine);
      res.status(200).json({ message: "Poste attribué avec succès pour la semaine." });
    } catch (error) {
      console.error("Erreur lors de l'attribution du poste :", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

exports.getUniquePostes = async (req, res) => {
    try {
        const postes = await TdcModel.getAllUniquePostes();
        res.json(postes);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des postes uniques :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


exports.getUniquePersonnel = async (req, res) => {
    try {
        const personnel = await TdcModel.getAllUniquePersonnel();
        res.json(personnel);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du personnel unique :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

  
