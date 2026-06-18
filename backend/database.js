const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('teste', 'postgres', 'postgres', {
  host: 'localhost',
  port: '5432',
  dialect: 'postgres',
  logging: false,
  // Descomenta as linhas abaixo se usarem SSL no Neon.tech:
  /*
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
  */
});

module.exports = sequelize;