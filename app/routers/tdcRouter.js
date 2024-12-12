// routes/tdcRouter.js

const express = require('express');
const router = express.Router();
const { getTauxDeChargePage } = require('../controllers/tdcController');

router.get('/tdcmen', getTauxDeChargePage);

module.exports = router;
