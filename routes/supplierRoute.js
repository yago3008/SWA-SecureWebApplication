const express = require('express');
const router = express.Router();
const { registerSupplierController, getSuppliersController } = require('../controllers/supplierController');
const { authenticateToken } = require('../middleware/auth');

router
    .post('/add', registerSupplierController)
    .get('/', getSuppliersController)

module.exports = router;