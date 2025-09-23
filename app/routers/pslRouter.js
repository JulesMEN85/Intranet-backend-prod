const express = require('express');
const { fetchPSLOrders } = require('../controllers/pslController');

const router = express.Router();

// Route to fetch PSL orders
router.get('/orders', fetchPSLOrders);

module.exports = router;
