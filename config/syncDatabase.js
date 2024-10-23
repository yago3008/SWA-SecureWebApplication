const { sequelize } = require('./database');
const { User, Product, Cart, Payment  } = require('../models/app');
const { hashPassword } = require('../services/handlerService');
const ATT_DATABASE = false;


const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: ATT_DATABASE });

        console.log('Database synchronized successfully.');
        createAdmin();
    } catch (err) {
        console.error('Error synchronizing the database:', err);
    }
};

const createAdmin = async () => {
    const adminExists = await User.findByPk(1)
    if (!adminExists) {
        try {
            const user = await User.create({
                username: 'admin',
                password: await hashPassword('admin'),
                role: 'admin',
                email: 'admin@admin.com',
                emailConfirmed: 'true'
            });
        } catch (err) {
            console.error('Error creating the admin user:', err);
        };
    };
};

module.exports = syncDatabase;
