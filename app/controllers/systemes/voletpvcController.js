const VoletModel = require("../../models/systemes/voletpvcModel");

// 🟢 Contrôleur pour récupérer les commandes des volets PVC 28 et PVC 24
const getVoletData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // 🔍 Vérification des paramètres requis
        if (!startDate || !endDate) {
            return res.status(400).json({ error: "❌ startDate et endDate sont requis" });
        }

        // 📦 Récupération des données via le modèle
        const data = await VoletModel.getVoletProducts(startDate, endDate);

        // 📤 Envoi des données récupérées
        res.json(data);
    } catch (error) {
        console.error("❌ Erreur dans getVoletData :", error); // Log détaillé pour le debug
        res.status(500).json({ error: "❌ Erreur serveur lors de la récupération des données Volet PVC" });
    }
};

module.exports = { getVoletData };
