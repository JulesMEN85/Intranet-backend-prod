const express = require('express');
const router = express.Router();
const { fetchCustomersWithName, fetchCustomerWithId, editCustomerRemise, fetchClientRemisesWinPro } = require('../controllers/editRemiseController')


router.get('/customers', fetchCustomersWithName); 
router.get('/customer', fetchCustomerWithId);
router.put('/edit/customer/:id', editCustomerRemise);
router.get('/customer-discount/:id', fetchClientRemisesWinPro);


module.exports = router;
