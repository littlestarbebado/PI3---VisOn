const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('teste', 'postgres', 'postgres', {
  host: 'localhost',
  port: '5432',
  dialect: 'postgres',
  logging: false,
  // Se usares o Neon.tech, descomenta as linhas abaixo:
  // dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

module.exports = sequelize;