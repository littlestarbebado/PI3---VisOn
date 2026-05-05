const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuração da ligação ao PostgreSQL
// Tenta ler do ficheiro .env, se não existir, usa os valores padrão locais
const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',       // Nome da base de dados no pgAdmin
  process.env.DB_USER || 'postgres',       // Utilizador padrão do Postgres
  process.env.DB_PASS || 'sua_password',   // MUDAR PARA A TUA PASSWORD DO PGADMIN
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false, // Para não encher o terminal com logs de SQL
  }
);

module.exports = sequelize;