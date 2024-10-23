const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Token = sequelize.define('Token', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    jwt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiresIn: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'tokens',
    timestamps: false
});

module.exports = Token;