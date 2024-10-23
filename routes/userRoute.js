const express = require('express');
const router = express.Router();
const {registerController, loginController, changePasswordController, forgotPasswordController, resetPasswordController, confirmEmailController, logoutController } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router
    .post('/register', registerController)
    .post('/login', loginController)
    .post('/change-password', authenticateToken, changePasswordController)
    .post('/forgot-password', forgotPasswordController)
    .get('/forgot-password', resetPasswordController)
    .get('/email-confirm', confirmEmailController)
    .get('/logout', authenticateToken, logoutController);

module.exports = router;