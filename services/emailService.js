const nodemailer = require('nodemailer');
const { encodeTranslationId } = require('../services/handlerService')
const User = require('../models/User');

let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
  });


const sendEmailForgetPassword = async (email) => {
    user = await User.findOne({ where: {email} });

    if(!user){
        throw new Error('User not found');
    }
    encodedUserId = encodeTranslationId(user.id);

    let emailPattern = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Recuperação de senha',
        text: 'Recuperação de senha',
        html:  `
        <h1>Recuperação de senha</h1>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="http://localhost:3000/user/forgot-password?id=${encodedUserId}">Recuperar senha</a>
        `
        };
        
    transporter.sendMail(emailPattern, function(err, info) {
        if (err) {
          throw new Error('Erro ao enviar o e-mail: ', err);
        }
        return('E-mail enviado com sucesso: ' + info.response);
      });
};

const sendEmailConfirmEmail = async (email) => {
    user = await User.findOne({ where: {email} });

    if(!user){
        throw new Error('User not found');
    }
    encodedUserId = encodeTranslationId(user.id);

    let emailPattern = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Confirmação de Email',
        text: 'Confirmação de Email',
        html:  `
        <h1>Confirmação de Email</h1>
        <p>Clique no link abaixo para confirmar seu Email:</p>
        <a href="http://localhost:3000/user/email-confirm?id=${encodedUserId}">Confirmar Email</a>
        `
        };
        
    transporter.sendMail(emailPattern, function(err, info) {
        if (err) {
          throw new Error('Erro ao enviar o e-mail: ', err);
        }
        return('E-mail enviado com sucesso: ' + info.response);
      });
};

module.exports = 
{
    sendEmailForgetPassword,
    sendEmailConfirmEmail
};