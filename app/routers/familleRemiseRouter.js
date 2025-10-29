const express = require('express');
const router = express.Router();
const {addFamilyDiscount, removeFamilyDiscount, fetchFamiliesDiscount, editFamilyDiscount, fetchFamilyDiscount} = require("../controllers/familleRemiseController");

//CRUD des familles de remises
//Récupérer toutes les remises
router.get('/get/:famille_remise', fetchFamilyDiscount);

//Récupérer une famille de remise à l'aide du code 
router.get('/all', fetchFamiliesDiscount);

//Ajouter une nouvelle famille de remise
router.post('/new', addFamilyDiscount);

//Modifier le nom d'une famille de remise
router.put('/edit/:famille_remise', editFamilyDiscount);

//Supprimer une famille de remise
router.delete('/delete/:famille_remise', removeFamilyDiscount);

module.exports = router