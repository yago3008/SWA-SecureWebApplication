const express = require('express');
const router = express.Router();
const { newProductController, getProductController, updateProductController, deleteProductController } = require('../controllers/productController');
const { isAdmin } = require('../middleware/auth');

router

    .post('/', isAdmin, newProductController)
    .get('/', getProductController)
    .put('/:productId', isAdmin, updateProductController)
    .delete('/:productId', isAdmin, deleteProductController);

module.exports = router;