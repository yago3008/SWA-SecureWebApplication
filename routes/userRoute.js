const express = require('express');
const router = express.Router();
const { registerController, loginController, changePasswordController } = require('../controllers/userController');
const { authenticateToken, isAdmin} = require('../middleware/auth');

router
    .post('/register', registerController)
    .post('/login', loginController)
    .post('/change-password', authenticateToken, changePasswordController)

module.exports = router;