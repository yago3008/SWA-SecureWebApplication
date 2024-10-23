const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { hashPassword, decodeTranslationId, getExpirationFromToken, deleteExpiredTokens } = require('../services/handlerService');
const { sendEmailConfirmEmail } = require('../services/emailService');


const registerUserService = async (username, password, email) => {
    const userExists = await User.findOne({ where: { username } })
    if (userExists){
        throw new Error('username already exists');
    }
    if (!email){
        throw new Error('Email is required');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, password: hashedPassword, email });
    await sendEmailConfirmEmail(email);
};

const generateTokenService = (userId, userRole, userEmail)  => {
    return jwt.sign({ id: userId, role: userRole, email: userEmail}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};


const loginUserService = async (username, password) =>{
    const user = await User.findOne({ where: { username } });
    if (!user){
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch){
        throw new Error('Invalid credentials');
    }
    if (!user.emailConfirmed){
        throw new Error('Email not confirmed');
    }

    const token = generateTokenService(user.id, user.role);
    user.password = ""
    return { user, token };
};

const changePasswordService = async (userId, newPassword) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (newPassword) {
        user.password = await hashPassword(newPassword)
    }

    await user.save();
};



const resetPasswordService = async (userId, newPassword) => {
    decodedUserId =  decodeTranslationId(userId);
    const user = await User.findByPk(decodedUserId);
    if (!user) {
        throw new Error('User not found');
    }
    user.password = await hashPassword(newPassword)
    await user.save();
    return user;
};

const confirmEmailService = async (userId) => {
    decodedUserId =  decodeTranslationId(userId);
    const user = await User.findByPk(decodedUserId);
    if (!user) {
        throw new Error('User not found');
    }
    user.emailConfirmed = true;
    await user.save();
    return user.email
};

const logoutService = async (token) => {
    await deleteExpiredTokens()
    const expiresIn = getExpirationFromToken(token);
    
    blackListedToken = await Token.create({
        jwt:token,
        expiresIn: expiresIn
    });
    await blackListedToken.save();
    return blackListedToken
};

module.exports = { 
    registerUserService,
    loginUserService,
    changePasswordService,
    resetPasswordService,
    confirmEmailService,
    logoutService
};

