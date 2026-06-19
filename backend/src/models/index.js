const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'vison_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
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
const Pedido = require('./Pedido')(sequelize);
const MensagemPedido = require('./MensagemPedido')(sequelize);
const Log = require('./Log')(sequelize);
const Incidente = require('./Incidente')(sequelize);

Cliente.hasMany(AtivoTecnologico, { foreignKey: 'ClienteId', as: 'ativos' });
AtivoTecnologico.belongsTo(Cliente, { foreignKey: 'ClienteId' });

Cliente.hasMany(Documento, { foreignKey: 'ClienteId', as: 'documentos' });
Documento.belongsTo(Cliente, { foreignKey: 'ClienteId' });

Cliente.hasMany(Pedido, { foreignKey: 'ClienteId', as: 'pedidos' });
Pedido.belongsTo(Cliente, { foreignKey: 'ClienteId', as: 'cliente' });

Pedido.hasMany(MensagemPedido, { foreignKey: 'PedidoId', as: 'mensagens', onDelete: 'CASCADE' });
MensagemPedido.belongsTo(Pedido, { foreignKey: 'PedidoId', as: 'pedido' });

Cliente.hasMany(Incidente, { foreignKey: 'ClienteId', as: 'incidentes' });
Incidente.belongsTo(Cliente, { foreignKey: 'ClienteId', as: 'cliente' });

async function ensureDefaultAdmin() {
  try {
    const bcrypt = require('bcryptjs');
    const defaultEmail = 'admin@vison.pt';
    const defaultPassword = 'Admin@1234';
    const defaultHash = await bcrypt.hash(defaultPassword, 10);

    const admin = await Admin.findOne({ where: { email: defaultEmail } });

    if (!admin) {
      await Admin.create({
        nome: 'Administrador',
        email: defaultEmail,
        password: defaultHash,
        role: 'Admin'
      });
      console.log(`Admin padrao criado no Postgres: ${defaultEmail} / ${defaultPassword}`);
      return;
    }

    const passwordValida = await bcrypt.compare(defaultPassword, admin.password || '');

    if (!passwordValida) {
      await admin.update({
        nome: admin.nome || 'Administrador',
        password: defaultHash,
        role: 'Admin'
      });
      console.log(`Password do Admin padrao reposta no Postgres: ${defaultEmail} / ${defaultPassword}`);
      return;
    }

    if (admin.role !== 'Admin') {
      await admin.update({ role: 'Admin' });
      console.log(`Role do Admin padrao corrigida para Admin: ${defaultEmail}`);
      return;
    }

    console.log('Admin padrao ja verificado e ativo no PostgreSQL.');
  } catch (err) {
    console.error('Erro ao verificar/criar Admin padrao:', err);
  }
}

async function ensureDemoUsers() {
  const bcrypt = require('bcryptjs');
  const password = 'Demo@1234';
  const passwordHash = await bcrypt.hash(password, 10);

  const [gestor] = await Admin.findOrCreate({
    where: { email: 'gestor@vison.pt' },
    defaults: {
      nome: 'Gestor Demonstração',
      password: passwordHash,
      role: 'Gestor',
      ativo: true
    }
  });
  await gestor.update({ password: passwordHash, role: 'Gestor', ativo: true });

  const [cliente] = await Cliente.findOrCreate({
    where: { email: 'cliente@vison.pt' },
    defaults: {
      nome: 'Empresa Demonstração',
      password: passwordHash,
      score: 75,
      status: true
    }
  });
  await cliente.update({ password: passwordHash, status: true });
}

module.exports = {
  sequelize,
  ensureDefaultAdmin,
  ensureDemoUsers,
  Admin,
  ConteudoInstitucional,
  Artigo,
  MensagemContacto,
  Cliente,
  AtivoTecnologico,
  Documento,
  Pedido,
  MensagemPedido,
  Log,
  Incidente
};
