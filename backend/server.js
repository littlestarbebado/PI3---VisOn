require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/conteudos', require('./routes/conteudos'));
app.use('/api/artigos', require('./routes/artigos'));
app.use('/api/contacto', require('./routes/contacto'));

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Base de dados sincronizada');
  app.listen(PORT, () => console.log(`🚀 Servidor a correr na porta ${PORT}`));
}).catch(err => console.error('❌ Erro na BD:', err));