const express = require('express');
const router = express.Router();
const { fetchCustomersWithName, fetchCustomerWithId, editCustomerRemise } = require('../controllers/editRemiseController')


router.get('/customers', fetchCustomersWithName); 
router.get('/customer', fetchCustomerWithId);
router.put('/edit/customer/:id', editCustomerRemise);


module.exports = router;
