// config/database.js
const { Sequelize } = require('sequelize');

module.exports = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});
