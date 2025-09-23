const express = require("express");
const router = express.Router();
const postesController = require("../controllers/postesController");

// Routes pour les affectations par défaut
router.get("/default-assignments", postesController.getDefaultAssignments);
router.post("/default-assignments", postesController.setDefaultAssignments);

router.get("/personnel-availability", postesController.getPersonnelAvailability);

module.exports = router;

router.delete("/default-assignments", postesController.deleteDefaultAssignments);
