const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API VIS ON a funcionar');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});

const sequelize = require('./src/config/database');
const AtivoTecnologico = require('./src/models/AtivoTecnologico');
const Documento = require('./src/models/Documento');

// Sincronizar com a Base de Dados
sequelize.sync({ alter: true }) // O 'alter: true' atualiza as tabelas se fizeres mudanças nos models
  .then(() => console.log('Tabelas do Gestor sincronizadas com o PostgreSQL!'))
  .catch(err => console.error('Erro a sincronizar com a BD:', err));

// Importar as rotas do Daniel
const ativoRoutes = require('./src/routes/ativoRoutes');

// Ativar as rotas com o prefixo /api/ativos
app.use('/api/ativos', ativoRoutes);

// Importar as rotas de Documentos do Daniel
const documentoRoutes = require('./src/routes/documentoRoutes');

// Ativar as rotas com o prefixo /api/documentos
app.use('/api/documentos', documentoRoutes);  