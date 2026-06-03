const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin, Cliente, Documento } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;
const { registrarLog } = require('../utils/logger');
const SECRET = process.env.JWT_SECRET || 'vison_secret_2024';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, SECRET, { expiresIn: '8h' });
      await registrarLog(admin.email, 'Login', `${admin.email} iniciou sessao como ${admin.role}`);
      return res.json({ token, admin: { id: admin.id, nome: admin.nome, email: admin.email, role: admin.role } });
    }

    const cliente = await Cliente.findOne({ where: { email } });
    if (cliente && (await bcrypt.compare(password, cliente.password))) {
      const token = jwt.sign({ id: cliente.id, email: cliente.email, role: 'Cliente' }, SECRET, { expiresIn: '8h' });
      await registrarLog(cliente.email, 'Login', `${cliente.email} iniciou sessao como Cliente`);
      return res.json({
        token,
        cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email, role: 'Cliente' }
      });
    }

    if (!admin && !cliente) {
      return res.status(401).json({ erro: 'Credenciais invalidas' });
    }

    return res.status(401).json({ erro: 'Credenciais invalidas' });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    if (req.user?.role === 'Cliente') {
      const cliente = await Cliente.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
      if (!cliente) return res.status(404).json({ erro: 'Cliente nao encontrado.' });
      return res.json({ ...cliente.toJSON(), role: 'Cliente' });
    }

    const admin = await Admin.findByPk(req.admin.id, { attributes: { exclude: ['password'] } });
    if (!admin) return res.status(404).json({ erro: 'Utilizador nao encontrado.' });
    res.json(admin);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// GET /api/auth/stats
router.get('/stats', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const clientes = await Cliente.count();
    const documentos = await Documento.count();
    const clientesRecentes = await Cliente.findAll({
      limit: 2,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'nome', 'email', 'score']
    });

    res.json({
      clientes,
      documentos,
      utilizadores: 5,
      atividade: 12,
      clientesRecentes
    });
  } catch (error) {
    console.error('Erro ao ir buscar estatisticas:', error);
    res.status(500).json({ erro: 'Erro ao carregar dados do Postgres.' });
  }
});

// GET /api/auth/utilizadores - listar todos os admins/gestores (protegido)
router.get('/utilizadores', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const utilizadores = await Admin.findAll({
      attributes: { exclude: ['password'] },
      order: [['nome', 'ASC']]
    });
    res.json(utilizadores);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// POST /api/auth/gestores - criar novo gestor (protegido)
router.post('/gestores', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const { nome, email, password, telefone } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ erro: 'Nome, email e password sao obrigatorios.' });
    }

    const existe = await Admin.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ erro: 'Ja existe um utilizador com este email.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const gestor = await Admin.create({ nome, email, password: hash, telefone, role: 'Gestor' });

    res.status(201).json({
      mensagem: 'Gestor criado com sucesso.',
      gestor: { id: gestor.id, nome: gestor.nome, email: gestor.email, role: gestor.role }
    });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// DELETE /api/auth/utilizadores/:id - eliminar utilizador (protegido)
router.delete('/utilizadores/:id', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const utilizador = await Admin.findByPk(req.params.id);

    if (!utilizador) {
      return res.status(404).json({ erro: 'Utilizador nao encontrado.' });
    }

    if (utilizador.email === 'admin@vison.pt') {
      return res.status(403).json({ erro: 'Nao e possivel eliminar o administrador principal.' });
    }

    await utilizador.destroy();
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

module.exports = router;
