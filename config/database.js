const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('trab_facul', 'trab_facul', 'trab_facul', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = { sequelize };
