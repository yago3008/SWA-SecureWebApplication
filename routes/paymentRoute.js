const express = require('express');
const router = express.Router();
const { paymentCreditCardController, paymentPixController, getPaymentStatusController } = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');
router

    .post('/credit-card', authenticateToken, paymentCreditCardController)
    .post('/pix', authenticateToken, paymentPixController)
    .get('/status/:transactionId', getPaymentStatusController);

module.exports = router;