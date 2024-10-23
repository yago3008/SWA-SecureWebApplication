const bcrypt = require('bcryptjs');
require('dotenv').config();
const Product = require("../models/product");
const Cart = require("../models/Cart");
const crypto = require('crypto');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

const hashPassword = async (newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    return hashedPassword

};

const quantityAvailable = async (productId, quantity)=> {
    const item = await Product.findByPk(productId);
    return item.stock >= quantity;
};

const decreaseStock = async (cartItems) => {
    for (let { productId, quantity } of cartItems) {
        const item = await Product.findByPk(productId);

        if (!item) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        if (item.stock < quantity) {
            throw new Error(`Not enough stock for product ID ${productId}`);
        }

        item.stock -= quantity;
        await item.save();
    }
};

const encodeTranslationId = (id) => {
    const ENCRYPTION_KEY = crypto.createHash('sha256').update('secret').digest('base64').substr(0, 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(String(id), 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const encryptedId = iv.toString('hex') + ':' + encrypted
    return encryptedId
};


const decodeTranslationId = (encryptedId) => {
    const ENCRYPTION_KEY = crypto.createHash('sha256').update('secret').digest('base64').substr(0, 32);
    
    const parts = encryptedId.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = parts.join(':');

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    const decodedId = Number(decrypted.trim());

    return decodedId;
};

const getProductsAndQuantity = async (cart) => {
    return cart.items.map(item => ({ productId: item.productId, quantity: item.quantity }));
};

const deleteCart = async (userId) => {
    const cart = await Cart.findOne({ where: userId });

    if(!cart){
        throw new Error("cart not found")
    }

    await cart.destroy();
    return(cart);
};

const getExpirationFromToken = (token) => {
     const decoded = jwt.decode(token);
    try {
        const decoded = jwt.decode(token);
        
        if (!decoded || !decoded.exp) {
            throw new Error('Token não contém informação de expiração');
        }
        
        return decoded.exp * 1000;
    } catch (error) {
        throw new Error('Erro ao decodificar o token: ' + error.message);
    }
};

const deleteExpiredTokens = async () => {
    try {
        const currentDateTime = new Date();
        const expiredTokens = await Token.findAll({
            where: {
                expiresIn: {
                    [Op.lt]: currentDateTime
                }
            }
        });

        if (expiredTokens.length > 0) {
            const idsToDelete = expiredTokens.map(token => token.id);
            await Token.destroy({
                where: {
                    id: idsToDelete
                }
            });
        };
    } catch (error) {
    }
};

module.exports = {
    hashPassword,
    quantityAvailable,
    decreaseStock,
    encodeTranslationId,
    decodeTranslationId,
    getProductsAndQuantity,
    deleteCart,
    getExpirationFromToken,
    deleteExpiredTokens
};