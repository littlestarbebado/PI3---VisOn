const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const auth = require('../middlewares/auth');
const SECRET = process.env.JWT_SECRET || 'vison_secret_2024';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return res.status(401).json({ erro: 'Credenciais inválidas' });

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, SECRET, { expiresIn: '8h' });
    res.json({ token, admin: { id: admin.id, nome: admin.nome, email: admin.email, role: admin.role } });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});
const { Cliente, Documento } = require('../models');

<<<<<<< HEAD
// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, { attributes: { exclude: ['password'] } });
    res.json(admin);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// GET /api/auth/utilizadores — listar todos os admins/gestores (protegido)
router.get('/utilizadores', auth, async (req, res) => {
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

// POST /api/auth/gestores — criar novo gestor (protegido)
router.post('/gestores', auth, async (req, res) => {
  try {
    const { nome, email, password, telefone } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ erro: 'Nome, email e password são obrigatórios.' });
    }

    const existe = await Admin.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ erro: 'Já existe um utilizador com este email.' });
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

// DELETE /api/auth/utilizadores/:id — eliminar utilizador (protegido)
router.delete('/utilizadores/:id', auth, async (req, res) => {
  try {
    const utilizador = await Admin.findByPk(req.params.id);

    if (!utilizador) {
      return res.status(404).json({ erro: 'Utilizador não encontrado.' });
    }

    // Proteger o admin principal
    if (utilizador.email === 'admin@vison.pt') {
      return res.status(403).json({ erro: 'Não é possível eliminar o administrador principal.' });
    }

    await utilizador.destroy();
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

module.exports = router;
=======
// ROTA GET: /api/auth/stats (Trazer dados reais para o Dashboard)
router.get('/stats', async (req, res) => {
  try {
    // 1. Conta quantos registos reais existem nas tabelas do Postgres
    const totalClientes = await Cliente.count();
    const totalDocumentos = await Documento.count();
    
    // Como ainda não temos a tabela de utilizadores gerais e logs a 100%, 
    // mandamos estes mockados por agora, mas os dois principais já são REAIS!
    const totalUtilizadores = 5; 
    const atividadeHoje = 14;

    res.json({
      clientes: totalClientes,
      documentos: totalDocumentos,
      utilizadores: totalUtilizadores,
      atividade: atividadeHoje
    });
  } catch (error) {
    console.error('Erro ao ir buscar estatísticas:', error);
    res.status(500).json({ erro: 'Erro ao carregar dados do Postgres.' });
  }
});
module.exports = router;
>>>>>>> dced1f5d21a0c10f1494650dcba152ec8d985464
