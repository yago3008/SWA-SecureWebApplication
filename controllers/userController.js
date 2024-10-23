const { registerUserService, loginUserService, changePasswordService, resetPasswordService, confirmEmailService, logoutService } = require('../services/userService');
const { sendEmailForgetPassword } = require('../services/emailService')

const registerController = async (req, res) => {

    const { username, password, email } = req.body;

    try{
        const newUser = await registerUserService(username, password, email);
        return res.status(200).json({ message: 'user registered successfully, Please confirm your registration'});
    } catch(err){
        return res.status(500).json({ error: err.message }); 
    };
};

const loginController = async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = await loginUserService(username, password);
        return res.status(200).json({ message: 'login successfully', user: user });
    } catch(err){
        return res.status(401).json({ error: err.message }); 
    }
};

const changePasswordController = async (req, res) => {
    const userId = req.user.id;
    const { password } = req.body;

    try {
        response = await changePasswordService(userId, password);
        res.status(200).json({ message: 'change password successfully', response: response });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const forgotPasswordController = async (req, res) => {
    const { email } = req.body;

    try{
        emailSent = await sendEmailForgetPassword(email);
        res.status(200).json({ message: 'email sent successfully', emailSent: emailSent });
    }catch(err){
        res.status(401).json({ error: err.message });
    }
};

const resetPasswordController = async (req, res) => {
    const { id } = req.query;
    const { newPassword } =  req.body;
    try{
        resetedPassword = await resetPasswordService(id, newPassword);
        res.status(200).json({ message: 'password reset successfully', resetedPassword: resetedPassword });
    }catch(err){
        res.status(401).json({ error: err.message });
    }
};

const confirmEmailController = async (req, res) => {
    const { id } = req.query;
    try{
        confirmedEmail = await confirmEmailService(id);
        res.status(200).json({ message: 'email confirmed successfully', confirmedEmail: confirmedEmail });
    }catch(err){
        res.status(401).json({ error: err.message });
    };
};

const logoutController = async (req, res)  => {
    const token = req.token;
    
    try{
        blackListedToken = await logoutService(token);
        res.status(200).json({ message: 'logout successfully', blackListedToken: blackListedToken });
    }
    catch(err){
        res.status(401).json({ error: err.message });
    }
};

module.exports = {
    registerController,
    loginController,
    changePasswordController,
    forgotPasswordController,
    resetPasswordController,
    confirmEmailController,
    logoutController,
};