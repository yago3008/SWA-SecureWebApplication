const jwt = require('jsonwebtoken');
require('dotenv').config();
const Token = require('../models/Token');

const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }
    blacklist = await Token.findOne({ where: { jwt: token}});
    if (blacklist) {
        return res.status(401).json({ message: 'Token has been blacklisted' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role != 'admin') {
            throw new Error('Access denied')
        }
            req.user = decoded;
            next();

    } catch (err) {
        return res.status(403).json({error: err.message});
    };
};

module.exports = { authenticateToken, isAdmin };