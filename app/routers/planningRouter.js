const express = require("express");
const router = express.Router();
const planningController = require("../controllers/planningController");

// Route : Récupérer les plannings d'une semaine donnée
router.get("/", planningController.getPlanningsByDateRange);

// Route : Récupérer les personnels de base
router.get("/base-personnel", planningController.getBasePersonnel);

// Route : Ajouter un personnel de base
router.post("/base-personnel", planningController.addBasePersonnel);

// Route : Ajouter un personnel avec plusieurs semaines
router.post("/with-personnel", planningController.addPersonnelWithWeeks);

// Route : Mettre à jour un personnel de base
router.put("/base-personnel/:id/:semaine", planningController.updateBasePersonnel);

// Route : Supprimer un personnel de base
router.delete("/base-personnel/:id/:semaine", planningController.deleteBasePersonnel);

router.get("/weekly-planning", planningController.getPlanningsByDateRange);


module.exports = router;
