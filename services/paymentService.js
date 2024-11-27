const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const { decreaseStock, encodeTranslationId, getProductsAndQuantity, decodeTranslationId } = require('./handlerService');
// - Rota para realizar pagamento via cartão de crédito (POST /payment/credit-card).
// - Rota para realizar pagamento via PIX (POST /payment/pix).
// - Rota para consultar transação (GET /payment/status/:transactionId).


const createTransaction = async (userId, paymentMethod) => {
    const cart = await Cart.findOne({ where: { userId } });
    try{
        const transaction = await Payment.create({
            userId: userId,
            totalPrice: cart.totalPrice,
            paymentMethod: paymentMethod,
            status: "completed"
            
        })
        return transaction.id
        
    } catch (err) {
        throw new Error('Error creating the transaction');
    }
};

const paymentCreditCardService = async (userId) => {
    const cart = await Cart.findOne({ where: { userId } });
    
    if (!cart) {
        throw new Error('Cart is empty');
    }
    try {
        const productsAndQuantity = await getProductsAndQuantity(cart);
        await decreaseStock(productsAndQuantity);
    } catch (err) {
        return err.message;
    };
    const transactionId = await createTransaction(userId, "credit-card")
    return encodeTranslationId(transactionId)
};

const paymentPixService = async (userId) => {
    const cart = await Cart.findOne({ where: { userId } });
    
    if (!cart) {
        throw new Error('Cart is empty');
    }
    try {
        const productsAndQuantity = await getProductsAndQuantity(cart);
        await decreaseStock(productsAndQuantity);
    } catch (err) {
        return err.message;
    };
    const transactionId = await createTransaction(userId, "pix")
    return encodeTranslationId(transactionId)
};

const getPaymentStatusService = async (encryptedPaymentId) => {
    const decodedTranslationId = decodeTranslationId(encryptedPaymentId);
    const payment = await Payment.findByPk(decodedTranslationId);
    if (!payment) {
        throw new Error('Payment not found');
    }
    return payment;
};

module.exports = {
    paymentCreditCardService,
    paymentPixService,
    getPaymentStatusService
};