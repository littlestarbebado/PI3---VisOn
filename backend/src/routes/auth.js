const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Admin, Cliente, Documento, Log, NIS2Assessment } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;
const { registrarLog } = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET
  || (process.env.NODE_ENV === 'production' ? null : 'vison_secret_2024');
if (!JWT_SECRET) throw new Error('JWT_SECRET e obrigatorio em producao.');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

function utilizadorPublico(utilizador, role) {
  return {
    id: utilizador.id,
    nome: utilizador.nome,
    email: utilizador.email,
    telefone: utilizador.telefone || null,
    role,
    ...(role === 'Cliente' ? { score: utilizador.score, status: utilizador.status } : {})
  };
}

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ erro: 'Email e password sao obrigatorios.' });
    }

    let utilizador = await Admin.findOne({ where: { email } });
    let role = utilizador?.role || null;

    if (!utilizador) {
      utilizador = await Cliente.findOne({ where: { email } });
      role = utilizador ? 'Cliente' : null;
    }

    if (!utilizador || !(await bcrypt.compare(password, utilizador.password || ''))) {
      return res.status(401).json({ erro: 'Credenciais invalidas.' });
    }

    const ativo = role === 'Cliente' ? utilizador.status !== false : utilizador.ativo !== false;
    if (!ativo) {
      return res.status(403).json({ erro: 'Conta suspensa. Acesso revogado.' });
    }

    const user = utilizadorPublico(utilizador, role);
    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    await registrarLog(user.email, 'Login', `Inicio de sessao como ${user.role}`);
    return res.json({ token, user });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ erro: 'Erro interno ao iniciar sessao.' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const role = req.user.role;
    const utilizador = role === 'Cliente'
      ? await Cliente.findByPk(req.user.id)
      : await Admin.findByPk(req.user.id);

    if (!utilizador) {
      return res.status(404).json({ erro: 'Utilizador nao encontrado.' });
    }

    const ativo = role === 'Cliente' ? utilizador.status !== false : utilizador.ativo !== false;
    if (!ativo) {
      return res.status(403).json({ erro: 'Conta suspensa. Acesso revogado.' });
    }

    return res.json({ user: utilizadorPublico(utilizador, role) });
  } catch (error) {
    console.error('Erro ao restaurar sessao:', error);
    return res.status(500).json({ erro: 'Erro interno ao validar sessao.' });
  }
});

router.post('/change-password', auth, async (req, res) => {
  try {
    const role = req.user.role;
    const currentPassword = String(req.body.currentPassword || '');
    const newPassword = String(req.body.newPassword || '');
    const confirmPassword = String(req.body.confirmPassword || '');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ erro: 'Password atual, nova password e confirmacao sao obrigatorias.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ erro: 'A confirmacao nao coincide com a nova password.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ erro: 'A nova password deve ter pelo menos 8 caracteres.' });
    }

    const Model = role === 'Cliente' ? Cliente : Admin;
    const utilizador = await Model.findByPk(req.user.id);

    if (!utilizador) {
      return res.status(404).json({ erro: 'Utilizador nao encontrado.' });
    }

    const passwordValida = await bcrypt.compare(currentPassword, utilizador.password || '');
    if (!passwordValida) {
      return res.status(401).json({ erro: 'A password atual esta incorreta.' });
    }

    utilizador.password = await bcrypt.hash(newPassword, 10);
    await utilizador.save();

    await registrarLog(req.user.email, 'Alterar Password', `Password alterada para ${role}`);
    return res.json({ mensagem: 'Password alterada com sucesso.' });
  } catch (error) {
    console.error('Erro ao alterar password:', error);
    return res.status(500).json({ erro: 'Erro interno ao alterar password.' });
  }
});

// Gestão de utilizadores no painel de administração.
router.get('/utilizadores', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const [equipa, clientes] = await Promise.all([
      Admin.findAll({ attributes: { exclude: ['password'] }, order: [['nome', 'ASC']] }),
      Cliente.findAll({ attributes: { exclude: ['password'] }, order: [['nome', 'ASC']] })
    ]);

    res.json([
      ...equipa.map(utilizador => utilizadorPublico(utilizador, utilizador.role || 'Gestor')),
      ...clientes.map(cliente => utilizadorPublico(cliente, 'Cliente'))
    ]);
  } catch (error) {
    console.error('Erro ao listar utilizadores:', error);
    res.status(500).json({ erro: 'Erro interno ao listar utilizadores.' });
  }
});

router.post('/gestores', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const nome = String(req.body.nome || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const telefone = String(req.body.telefone || '').trim() || null;
    const password = String(req.body.password || '');

    if (!nome || !email || !password) {
      return res.status(400).json({ erro: 'Nome, email e password sao obrigatorios.' });
    }

    const [adminExistente, clienteExistente] = await Promise.all([
      Admin.findOne({ where: { email } }),
      Cliente.findOne({ where: { email } })
    ]);
    if (adminExistente || clienteExistente) {
      return res.status(409).json({ erro: 'Ja existe um utilizador com este email.' });
    }

    const gestor = await Admin.create({
      nome,
      email,
      telefone,
      password: await bcrypt.hash(password, 10),
      role: 'Gestor',
      ativo: true
    });
    await registrarLog(req.user.email, 'Criar Gestor', `Gestor criado: ${email}`);
    res.status(201).json({ user: utilizadorPublico(gestor, 'Gestor') });
  } catch (error) {
    console.error('Erro ao criar gestor:', error);
    res.status(500).json({ erro: 'Erro interno ao criar gestor.' });
  }
});

router.delete('/utilizadores/:role/:id', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const role = String(req.params.role || '');
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ erro: 'Utilizador invalido.' });
    if (!['Gestor', 'Cliente'].includes(role)) {
      return res.status(403).json({ erro: 'Este tipo de utilizador nao pode ser removido.' });
    }

    const Model = role === 'Cliente' ? Cliente : Admin;
    const utilizador = await Model.findByPk(id);
    if (!utilizador || (role === 'Gestor' && utilizador.role !== 'Gestor')) {
      return res.status(404).json({ erro: 'Utilizador nao encontrado.' });
    }

    const email = utilizador.email;
    await utilizador.destroy();
    await registrarLog(req.user.email, 'Remover Utilizador', `${role} removido: ${email}`);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover utilizador:', error);
    res.status(500).json({ erro: 'Erro interno ao remover utilizador.' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const clientes = await Cliente.count();
    const utilizadores = await Admin.count();
    const documentos = await Documento.count();
    const atividade = await Log.count();

    res.json({
      clientes,
      utilizadores,
      documentos,
      atividade,
      clientesRecentes: []
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      erro: 'Erro ao obter estatísticas'
    });
  }
});

module.exports = router;
