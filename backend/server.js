const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize, ensureDefaultAdmin } = require('./src/models');

const app = express();

// Middlewares essenciais para ler dados de formulários (JSON)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir a pasta de uploads para os PDFs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Registo de Rotas do Sistema
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/clientes', require('./src/routes/clientes')); // <--- Tem de estar aqui!
app.use('/api/ativos', require('./src/routes/ativos'));
app.use('/api/conteudos', require('./src/routes/conteudos'));
app.use('/api/artigos', require('./src/routes/artigos'));
app.use('/api/contacto', require('./src/routes/contacto'));

// Sincronização da Base de Dados PostgreSQL
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(async () => {
    await ensureDefaultAdmin();
  console.log('Base de dados sincronizada com o PostgreSQL');
  app.listen(PORT, () => {
    console.log(`Servidor a correr com sucesso na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao sincronizar base de dados:', err);
});
