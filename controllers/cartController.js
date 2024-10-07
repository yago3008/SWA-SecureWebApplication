const { addItemService, removeItemService, getItensService } = require("../services/cartService");

const addItemController = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } =  req.body;


    try{
        const addedItem = await addItemService(userId, productId, quantity)
        res.status(200).json(addedItem);
    } catch(err){
        res.status(400).json({ error: err.message });
    };
};

const removeItemController = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    try{

       const cart =  await removeItemService(userId, productId, quantity);
        res.status(200).json({ message: 'Item removed successfully', cart: cart });
    } catch(err) {
        res.status(400).json({ error: err.message });
    }
};

const getItensController = async (req, res) => {
    const userId = req.user.id
    try {
        const cart = await getItensService(userId);
        res.status(200).json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    };
};

module.exports = {
    addItemController,
    removeItemController,
    getItensController

};