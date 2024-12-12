const express = require("express");
const router = express.Router();
const planningController = require("../controllers/planningController");

// Vérification de l'import des fonctions du contrôleur
console.log("Planning Controller:", planningController);

router.get("/", planningController.getPlanningsByDateRange); // Basé sur la semaine

// Récupération des personnels de base
router.get('/base-personnel', (req, res) => {
    console.log("Route GET /base-personnel appelée");
    return planningController.getBasePersonnel(req, res);
});

// Ajout de personnel de base
router.post("/base-personnel", (req, res) => {
    console.log("Route POST /base-personnel appelée avec body :", req.body);
    return planningController.addBasePersonnel(req, res);
});

// Mise à jour d'un personnel de base
router.put("/base-personnel/:id", (req, res) => {
    console.log(`Route PUT /base-personnel/${req.params.id} appelée avec body :`, req.body);
    return planningController.updateBasePersonnel(req, res);
});

// Suppression d'un personnel de base
router.delete("/base-personnel/:id", (req, res) => {
    console.log(`Route DELETE /base-personnel/${req.params.id} appelée`);
    return planningController.deleteBasePersonnel(req, res);
});

// Ajout de personnel avec gestion des semaines
router.post("/with-personnel", (req, res) => {
    console.log("Route POST /with-personnel appelée avec body :", req.body);
    return planningController.addPersonnelWithWeeks(req, res);
});

router.post("/base-personnel", planningController.addBasePersonnel);

module.exports = router;
