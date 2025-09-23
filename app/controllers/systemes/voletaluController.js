const VoletAluModel = require("../../models/systemes/voletaluModel");

// 🟢 Contrôleur pour récupérer les commandes des volets ALU
const getVoletAluData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // 🔍 Vérification des paramètres requis
        if (!startDate || !endDate) {
            return res.status(400).json({ error: "❌ startDate et endDate sont requis" });
        }

        // 📦 Récupération des données via le modèle
        const data = await VoletAluModel.getVoletAluProducts(startDate, endDate);

        // 📤 Envoi des données récupérées
        res.json(data);
    } catch (error) {
        console.error("❌ Erreur dans getVoletAluData :", error); // Log détaillé pour le debug
        res.status(500).json({ error: "❌ Erreur serveur lors de la récupération des données Volet ALU" });
    }
};

module.exports = { getVoletAluData };
