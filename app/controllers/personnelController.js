const PersonnelModel = require("../models/PersonnelModel");
const PlanningModel = require("../models/PlanningModel");

// Récupérer toutes les personnes
exports.getAllPersonnel = async (req, res) => {
  try {
    const personnel = await PersonnelModel.getAllPersonnel();
    res.json(personnel);
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données" });
  }
};

// Ajouter une nouvelle personne
exports.addPersonnel = async (req, res) => {
  try {
    const { name } = req.body; // Ajouter uniquement le nom dans la table personnel
    console.log("Données reçues pour ajout :", req.body);

    // Ajouter une personne dans la table personnel
    const newPerson = await PersonnelModel.addPersonnel({ name });

    // Ajouter un planning vide pour cette personne dans la table planning
    await PlanningModel.addEmptyPlanning(newPerson.id);

    res.status(201).json({ message: "Personne ajoutée avec succès", person: newPerson });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la personne :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de la personne" });
  }
};

// Modifier un personnel et ses heures de planning
exports.updatePersonnel = async (req, res) => {
  const { id } = req.params; // ID du personnel
  const { name, lundi, mardi, mercredi, jeudi, vendredi } = req.body;

  try {
      // Étape 1 : Mettre à jour le nom du personnel dans la table `personnel`
      if (name) {
          console.log(`Mise à jour du nom dans personnel pour id ${id} : ${name}`);
          await PersonnelModel.updatePersonnel(id, { name });
      }

      // Étape 2 : Mettre à jour les heures dans la table `planning`
      console.log(`Mise à jour ou insertion des heures pour personnel_id ${id}`);
      await PlanningModel.updatePlanningByPersonnelId(id, {
          lundi,
          mardi,
          mercredi,
          jeudi,
          vendredi,
      });

      res.status(200).json({ message: "Mise à jour réussie." });
  } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      res.status(500).json({ error: "Erreur lors de la mise à jour." });
  }
};

// Supprimer une personne
exports.deletePersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID de la personne à supprimer :", id);

    // Supprimer les entrées associées dans la table planning
    await PlanningModel.deletePlanningByPersonnelId(id);

    // Supprimer la personne dans la table personnel
    const result = await PersonnelModel.deletePersonnel(id);
    console.log("Résultat de la suppression :", result);

    res.json({ message: "Personne supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la personne :", error);
    res.status(500).json({ error: "Erreur lors de la suppression de la personne" });
  }
};
