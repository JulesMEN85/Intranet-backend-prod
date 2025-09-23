const postesModel = require("../models/postesModel");
const historiquesModel = require("../models/historiquesModel");

// 📌 Récupérer les affectations par défaut
exports.getDefaultAssignments = async (req, res) => {
    try {
        const assignments = await postesModel.getDefaultAssignments();
        
        // Calculer le total des heures disponibles par semaine
        const formattedAssignments = assignments.map(assignment => {
            const totalHeuresDispo = 
                (assignment.lundi || 0) + 
                (assignment.mardi || 0) + 
                (assignment.mercredi || 0) + 
                (assignment.jeudi || 0) + 
                (assignment.vendredi || 0);

            return {
                poste_code: assignment.poste_code,
                personnel_id: assignment.personnel_id,
                name: assignment.name,
                semaine: assignment.semaine,
                total_heures_disponible: totalHeuresDispo,
            };
        });


        res.json(formattedAssignments);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des affectations par défaut :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// 📌 Enregistrer une affectation par défaut
exports.setDefaultAssignments = async (req, res) => {
    console.log("📥 Données reçues dans le backend :", req.body);

    const assignments = req.body; // Attend un tableau [{ poste_code, personnel_id }, ...]

    if (!Array.isArray(assignments) || assignments.length === 0) {
        return res.status(400).json({ message: "Aucune affectation envoyée." });
    }

    try {
        for (const assignment of assignments) {
            const { poste_code, personnel_id } = assignment;


            if (!poste_code || !personnel_id) {
                console.error("❌ Données incomplètes :", assignment);
                return res.status(400).json({ message: "Données incomplètes pour une affectation." });
            }

            await postesModel.setDefaultAssignment(poste_code, personnel_id);
        }

        res.status(200).json({ message: "Toutes les affectations ont été enregistrées avec succès." });
    } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement des affectations :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};




// 📌 Récupérer les affectations pour une semaine spécifique
exports.getWeeklyAssignments = async (req, res) => {
    const { semaine, annee } = req.query;

    if (!semaine || !annee) {
        return res.status(400).json({ message: "Semaine et année requises." });
    }

    try {
        const assignments = await historiquesModel.getWeeklyAssignments(semaine, annee);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 📌 Récuperer les heures disponibles en fonction de la semaine et du nom 
exports.getPersonnelAvailability = async (req, res) => {
    const { name, semaine } = req.query;

    try {
        const data = await postesModel.getPersonnelAvailability(name, semaine);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 📌 Supprimer des affectations par défaut
exports.deleteDefaultAssignments = async (req, res) => {
    const { poste_codes } = req.body; // Attend un tableau de codes de poste à supprimer

    if (!Array.isArray(poste_codes) || poste_codes.length === 0) {
        return res.status(400).json({ message: "Aucun code de poste fourni pour suppression." });
    }

    try {
        for (const poste_code of poste_codes) {
            console.log(`🗑️ Suppression de l'affectation pour le poste : ${poste_code}`);
            await postesModel.deleteDefaultAssignment(poste_code);
        }

        res.status(200).json({ message: "Affectations supprimées avec succès." });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression des affectations :", error);
        res.status(500).json({ message: "Erreur serveur lors de la suppression." });
    }
};
