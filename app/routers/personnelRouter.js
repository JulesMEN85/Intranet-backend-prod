// routers/PersonnelRouter.js

const express = require("express");
const router = express.Router();
const PersonnelController = require("../controllers/personnelController");

// Route pour récupérer toutes les personnes
router.get("/", PersonnelController.getAllPersonnel);

// Route pour ajouter une personne
router.post("/", PersonnelController.addPersonnel);

// Route pour mettre à jour une personne
router.put("/:id", PersonnelController.updatePersonnel);

// Route pour supprimer une personne
router.delete("/:id", PersonnelController.deletePersonnel);

module.exports = router;
