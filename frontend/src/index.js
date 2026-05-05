const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false
});

// Import models
const Admin = require('./Admin')(sequelize);
const ConteudoInstitucional = require('./ConteudoInstitucional')(sequelize);
const Artigo = require('./Artigo')(sequelize);
const MensagemContacto = require('./MensagemContacto')(sequelize);

// Seed default admin if not exists
sequelize.sync().then(async () => {
  const bcrypt = require('bcryptjs');
  const count = await Admin.count();
  if (count === 0) {
    await Admin.create({
      nome: 'Administrador',
      email: 'admin@vison.pt',
      password: await bcrypt.hash('Admin@1234', 10)
    });
    console.log('👤 Admin padrão criado: admin@vison.pt / Admin@1234');
  }
});

module.exports = { sequelize, Admin, ConteudoInstitucional, Artigo, MensagemContacto };