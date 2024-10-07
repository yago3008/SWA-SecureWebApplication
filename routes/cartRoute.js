const express = require('express');
const router = express.Router();
const { addItemController, removeItemController, getItensController } = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

router
    .post('/add', authenticateToken, addItemController)
    .delete('/remove/:productId', authenticateToken, removeItemController)
    .get('/', authenticateToken, getItensController)

module.exports = router;