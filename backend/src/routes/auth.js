const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Admin, Cliente, Documento, Log } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;
const { registrarLog } = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'vison_secret_2024';
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

// GET /api/auth/utilizadores - lista conjunta para a gestao de utilizadores
router.get('/utilizadores', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const [adminsEGestores, clientes] = await Promise.all([
      Admin.findAll({
        attributes: ['id', 'nome', 'email', 'telefone', 'role'],
        order: [['nome', 'ASC']]
      }),
      Cliente.findAll({
        attributes: ['id', 'nome', 'email', 'telefone', 'score', 'status'],
        order: [['nome', 'ASC']]
      })
    ]);

    const utilizadores = [
      ...adminsEGestores.map((utilizador) =>
        utilizadorPublico(utilizador, utilizador.role || 'Gestor')
      ),
      ...clientes.map((cliente) => utilizadorPublico(cliente, 'Cliente'))
    ];

    return res.json(utilizadores);
  } catch (error) {
    console.error('Erro ao listar utilizadores:', error);
    return res.status(500).json({ erro: 'Erro interno ao listar utilizadores.' });
  }
});

router.post('/gestores', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const nome = String(req.body.nome || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const telefone = String(req.body.telefone || '').trim() || null;

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
    await registrarLog(req.user.email, 'Criar Gestor', `Gestor criado: ${email} (${nome})`);
    return res.status(201).json(utilizadorPublico(gestor, 'Gestor'));
  } catch (error) {
    console.error('Erro ao criar gestor:', error);
    return res.status(500).json({ erro: 'Erro interno ao criar gestor.' });
  }
});

router.delete('/utilizadores/:role/:id', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const role = req.params.role;
    if (!['Gestor', 'Cliente'].includes(role)) {
      return res.status(400).json({ erro: 'Tipo de utilizador invalido.' });
    }

    const Model = role === 'Cliente' ? Cliente : Admin;
    const utilizador = await Model.findByPk(req.params.id);
    if (!utilizador || (role === 'Gestor' && utilizador.role !== 'Gestor')) {
      return res.status(404).json({ erro: 'Utilizador nao encontrado.' });
    }

    await utilizador.destroy();
    await registrarLog(req.user.email, 'Remover Utilizador', `${role} removido: ${utilizador.email}`);
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover utilizador:', error);
    return res.status(500).json({ erro: 'Erro interno ao remover utilizador.' });
  }
});

router.get('/stats', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const inicioHoje = new Date();
    inicioHoje.setHours(0, 0, 0, 0);

    const inicioAmanha = new Date(inicioHoje);
    inicioAmanha.setDate(inicioAmanha.getDate() + 1);

    const [clientes, adminsEGestores, documentos, atividadeHoje, clientesRecentes] =
      await Promise.all([
        Cliente.count(),
        Admin.count(),
        Documento.count(),
        Log.count({
          where: {
            createdAt: { [Op.gte]: inicioHoje, [Op.lt]: inicioAmanha }
          }
        }),
        Cliente.findAll({
          attributes: ['id', 'nome', 'email', 'score', 'createdAt'],
          order: [['createdAt', 'DESC']],
          limit: 5
        })
      ]);

    return res.json({
      clientes,
      utilizadores: adminsEGestores + clientes,
      documentos,
      atividade: atividadeHoje,
      atividadeHoje,
      clientesRecentes
    });
  } catch (error) {
    console.error('Erro ao carregar estatisticas:', error);
    return res.status(500).json({ erro: 'Erro interno ao carregar estatisticas.' });
  }
});

module.exports = router;
