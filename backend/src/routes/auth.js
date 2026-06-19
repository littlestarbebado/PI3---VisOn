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
