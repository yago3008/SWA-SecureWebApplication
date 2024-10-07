const Cart = require('../models/Cart');
const Product = require('../models/product');
const { quantityAvailable } = require('./handlerService');

const addItemService = async (userId, productId, quantity) => {
    const item = await Product.findByPk(productId);
    if (!item) {
        throw new Error('Product not found');
    }
    if (!(await quantityAvailable(productId, quantity)) || quantity < 1 ){
        throw new Error('Quantity out of stock');
    }
    if (!Number.isInteger(quantity)){
        throw new Error('Invalid quantity');
    }

    const [ cart ] = await Cart.findOrCreate({
        where: { userId },
        defaults: {
            items: [],
            totalPrice: 0.00
        }
    });


    let updatedItems = JSON.parse(JSON.stringify(cart.items)); //Copia profunda para nao alterar o array 
    let existingItem = updatedItems.find(cartItem => cartItem.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        updatedItems.push({
            productId: productId,
            quantity: quantity,
            price: item.price
        });
    }

    const newTotalPrice = updatedItems.reduce((total, cartItem) => {
        return total + cartItem.price * cartItem.quantity;
    }, 0);

    await cart.update({
        items: updatedItems,
        totalPrice: newTotalPrice
    });

    return cart;
};

const removeItemService = async (userId, productId, quantity) => {
    const cart = await Cart.findOne({
        where: { userId }
    });

    if (!cart) {
        throw new Error('Cart is empty');
    }
    if (quantity < 1 || !Number.isInteger(quantity)) {
        throw new Error('Invalid quantity');
    }

    let updatedItems = JSON.parse(JSON.stringify(cart.items));
    const numericProductId = Number(productId);
    const existingItem = updatedItems.find(item => item.productId === numericProductId);
    
    if (!existingItem) {
        throw new Error('Product not found in cart');
    }

    existingItem.quantity -= quantity;

    if (existingItem.quantity <= 0) {
        updatedItems = updatedItems.filter(item => item.productId !== numericProductId);
    }

    const newTotalPrice = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.update({
        items: updatedItems,
        totalPrice: newTotalPrice
    });

    return cart;
};




const getItensService = async (userId) => {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
        throw new Error('Cart is empty');
    }

    return cart;
};

module.exports = {
    addItemService,
    removeItemService,
    getItensService
};