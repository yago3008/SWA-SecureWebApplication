const { paymentCreditCardService, paymentPixService, getPaymentStatusService } = require("../services/paymentService");
const { deleteCart } = require("../services/handlerService");

const paymentCreditCardController = async (req, res) => {
    const userId = req.user.id;
    try{
        const transactionId = await paymentCreditCardService(userId)
        deleteCart(userId);
        res.status(200).json({ message: 'Payment success', transactionId: transactionId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    };
    
};

const paymentPixController = async (req, res) => {
    const userId = req.user.id;

    try{
        const transactionId = await paymentPixService(userId)
        deleteCart(userId);
        res.status(200).json({ message: 'Payment success', transactionId: transactionId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    };
};

const getPaymentStatusController = async (req, res) => {
    const { transactionId } = req.params

    try{
        const payment = await getPaymentStatusService(transactionId)
        res.status(200).json({ message: 'Payment', payment: payment });
    } catch (err) {
        res.status(400).json({ error: err.message });
    };
 
};

module.exports = {
    paymentCreditCardController,
    paymentPixController,
    getPaymentStatusController,

};