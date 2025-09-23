const express = require("express");
const router = express.Router();

// Import des contrôleurs pour chaque système
const pspController = require("../controllers/systemes/pspController");
const syspslController = require("../controllers/systemes/syspslController");
const voletpvcController = require("../controllers/systemes/voletpvcController");
const voletaluController = require("../controllers/systemes/voletaluController"); 
const getPGBPGCLines = require("../controllers/systemes/pgb-pgcController");
const getPVC38Lines = require("../controllers/systemes/pvc38Controller");

// Routes pour chaque système
router.get("/psp", pspController.getPSPData);
router.get("/psl", syspslController.fetchPSLProducts);
router.get("/volet", voletpvcController.getVoletData);
router.get("/voletalu", voletaluController.getVoletAluData); 
router.get("/pgbpgc", getPGBPGCLines.fetchPGBPGCLines); 
router.get("/pvc38", getPVC38Lines.fetchPVC38Lines); 

router.get("/postes-personnel", pspController.getPostesPersonnel);

module.exports = router;
