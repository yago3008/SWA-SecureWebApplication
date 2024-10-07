const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },desc: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: false
    }, stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    }
}, {
    tableName: 'products',
    timestamps: false
});

module.exports = Product;