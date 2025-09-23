const PlanningModel = require('../models/planningModel');

exports.getBasePersonnel = async (req, res) => {
    try {
        const personnel = await PlanningModel.getBasePersonnel();
        res.status(200).json(personnel);
    } catch (error) {
        console.error("Erreur lors de la récupération des personnels de base :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des personnels de base." });
    }
};

exports.addBasePersonnel = async (req, res) => {
    console.log("Données reçues dans addBasePersonnel :", req.body);

    const { name, semaines, lundi, mardi, mercredi, jeudi, vendredi } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Le champ 'name' est obligatoire." });
    }

    if (!semaines || !Array.isArray(semaines) || semaines.length === 0) {
        return res.status(400).json({ message: "Veuillez sélectionner au moins une semaine." });
    }

    try {
        for (const semaine of semaines) {
            await PlanningModel.addBasePersonnel(
                name,
                lundi || "00:00",
                mardi || "00:00",
                mercredi || "00:00",
                jeudi || "00:00",
                vendredi || "00:00",
                semaine
            );
        }

        res.status(201).json({ message: "Personnel ajouté avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'ajout du personnel de base :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};


exports.addPersonnelWithWeeks = async (req, res) => {
    const { name, semaines, lundi, mardi, mercredi, jeudi, vendredi } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Le champ 'name' est obligatoire." });
    }

    if (!semaines || !Array.isArray(semaines) || semaines.length === 0) {
        return res.status(400).json({ message: "Veuillez sélectionner au moins une semaine." });
    }

    try {
        const insertPromises = semaines.map((semaine) =>
            PlanningModel.addBasePersonnel(
                name,
                lundi || "00:00",
                mardi || "00:00",
                mercredi || "00:00",
                jeudi || "00:00",
                vendredi || "00:00",
                semaine
            )
        );

        await Promise.all(insertPromises);

        res.status(201).json({ message: "Personnel ajouté avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'ajout du personnel :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};


exports.updateBasePersonnel = async (req, res) => {
    const { id } = req.params;
    const { name, lundi, mardi, mercredi, jeudi, vendredi } = req.body;

    try {
        await PlanningModel.updateBasePersonnel(id, name, lundi, mardi, mercredi, jeudi, vendredi);
        res.status(200).json({ message: "Personnel de base mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du personnel de base :", error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBasePersonnel = async (req, res) => {
    const { id } = req.params;

    try {
        await PlanningModel.deleteBasePersonnel(id);
        res.status(200).json({ message: "Personnel de base supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression du personnel de base :", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getPlanningsByDateRange = async (req, res) => {
    try {
        const { startDate } = req.query;

        if (!startDate) {
            return res.status(400).json({ message: "La semaine est requise" });
        }

        const plannings = await PlanningModel.getWeeklyPlanning(startDate);
        res.json(plannings);
    } catch (error) {
        console.error("Erreur lors de la récupération des plannings :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des plannings" });
    }
};

exports.generateWeeklyPlanning = async (req, res) => {
    const { semaine } = req.query;

    try {
        await PlanningModel.generateWeeklyPlanning(semaine);
        res.status(200).json({ message: `Planning généré pour la semaine ${semaine}.` });
    } catch (error) {
        console.error("Erreur lors de la génération du planning :", error);
        res.status(500).json({ message: error.message });
    }
};

