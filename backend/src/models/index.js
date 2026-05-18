const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'vison_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

const Admin = require('./Admin')(sequelize);
const ConteudoInstitucional = require('./ConteudoInstitucional')(sequelize);
const Artigo = require('./Artigo')(sequelize);
const MensagemContacto = require('./MensagemContacto')(sequelize);
const Cliente = require('./cliente')(sequelize);
const AtivoTecnologico = require('./ativotecnologico')(sequelize);
const Documento = require('./documento')(sequelize);

Cliente.hasMany(AtivoTecnologico, { foreignKey: 'ClienteId', as: 'ativos' });
AtivoTecnologico.belongsTo(Cliente, { foreignKey: 'ClienteId' });

Cliente.hasMany(Documento, { foreignKey: 'ClienteId', as: 'documentos' });
Documento.belongsTo(Cliente, { foreignKey: 'ClienteId' });

async function ensureDefaultAdmin() {
  try {
    const bcrypt = require('bcryptjs');

    const [, criado] = await Admin.findOrCreate({
      where: { email: 'admin@vison.pt' },
      defaults: {
        nome: 'Administrador',
        password: await bcrypt.hash('Admin@1234', 10)
      }
    });

    if (criado) {
      console.log('Admin padrao criado no Postgres: admin@vison.pt / Admin@1234');
    } else {
      console.log('Admin padrao ja verificado e ativo no PostgreSQL.');
    }
  } catch (err) {
    console.error('Erro ao verificar/criar Admin padrao:', err);
  }
}

module.exports = {
  sequelize,
  ensureDefaultAdmin,
  Admin,
  ConteudoInstitucional,
  Artigo,
  MensagemContacto,
  Cliente,
  AtivoTecnologico,
  Documento
};
