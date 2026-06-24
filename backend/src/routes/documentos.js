const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Documento, Cliente } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;
const { registrarLog } = require('../utils/logger');
const { responderSeClienteNaoAcessivel } = require('../utils/accessControl');

const CATEGORIAS_CLIENTE = ['Evidencia', 'Pen Test', 'Documentacao', 'Outros'];
const ESTADOS_SUBMISSAO = ['Pendente', 'Em Analise', 'Concluido'];

// Configuração de upload
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const tipos = ['.pdf', '.doc', '.docx', '.xlsx', '.txt', '.png', '.jpg'];
    if (tipos.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Tipo de ficheiro não suportado.'));
  }
});

// GET /api/documentos — Admin/Gestor: todos; Cliente: os seus
router.get('/', auth, async (req, res) => {
  try {
    const role = req.user?.role;
    const where = {};
    if (role === 'Cliente') where.ClienteId = req.user.id;
    if (role === 'Gestor') {
      const clientes = await Cliente.findAll({
        where: { GestorResponsavelId: req.user.id },
        attributes: ['id']
      });
      where.ClienteId = clientes.map(cliente => cliente.id);
    }

    const documentos = await Documento.findAll({
      where,
      include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nome', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(documentos);
  } catch (e) {
    console.error('Erro ao listar documentos:', e);
    res.status(500).json({ erro: 'Erro interno ao listar documentos.' });
  }
});

// POST /api/documentos/submeter — Cliente submete evidencia ou pen test
router.post('/submeter', auth, requireRole(['Cliente']), upload.single('ficheiro'), async (req, res) => {
  try {
    const { nome, descricao, categoria } = req.body;

    if (!req.file) return res.status(400).json({ erro: 'Ficheiro obrigatorio.' });
    if (!CATEGORIAS_CLIENTE.includes(categoria)) {
      return res.status(400).json({ erro: 'Categoria de submissao invalida.' });
    }

    const doc = await Documento.create({
      nome: nome || req.file.originalname,
      tipo: path.extname(req.file.originalname).replace('.', '').toUpperCase(),
      caminho: `/uploads/${req.file.filename}`,
      descricao,
      categoria,
      estado: 'Pendente',
      ClienteId: req.user.id
    });

    await registrarLog(
      req.user.email,
      'Submeter Documento',
      `${categoria} submetida: "${doc.nome}"`
    );

    res.status(201).json(doc);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// POST /api/documentos — Admin/Gestor: carrega documento para um cliente
router.post('/', auth, requireRole(['Admin', 'Gestor']), upload.single('ficheiro'), async (req, res) => {
  try {
    const { nome, descricao, ClienteId, categoria } = req.body;
    if (!ClienteId) return res.status(400).json({ erro: 'ClienteId e obrigatorio.' });
    if (await responderSeClienteNaoAcessivel(req, res, ClienteId)) return;

    const doc = await Documento.create({
      nome: nome || req.file?.originalname || 'Documento',
      tipo: req.file ? path.extname(req.file.originalname).replace('.', '').toUpperCase() : null,
      caminho: req.file ? `/uploads/${req.file.filename}` : null,
      descricao,
      categoria: categoria || 'Documento',
      estado: 'Concluido',
      ClienteId
    });

    const cliente = await Cliente.findByPk(ClienteId, { attributes: ['email', 'nome'] });
    await registrarLog(req.user.email, 'Criar Documento', `Documento "${doc.nome}" carregado para cliente ${cliente?.email || ClienteId}`);

    res.status(201).json(doc);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// PUT /api/documentos/:id/estado — Gestor/Admin atualiza workflow da submissao
router.put('/:id/estado', auth, requireRole(['Admin', 'Gestor']), async (req, res) => {
  try {
    const { estado } = req.body;
    if (!ESTADOS_SUBMISSAO.includes(estado)) {
      return res.status(400).json({ erro: 'Estado invalido.' });
    }

    const doc = await Documento.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ erro: 'Documento nao encontrado.' });
    if (await responderSeClienteNaoAcessivel(req, res, doc.ClienteId)) return;

    await doc.update({ estado });
    await registrarLog(req.user.email, 'Alterar Estado Documento', `Documento #${doc.id} movido para ${estado}`);
    res.json(doc);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// DELETE /api/documentos/:id — Admin/Gestor
router.delete('/:id', auth, requireRole(['Admin', 'Gestor']), async (req, res) => {
  try {
    const doc = await Documento.findByPk(req.params.id, {
      include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nome', 'email'] }]
    });
    if (!doc) return res.status(404).json({ erro: 'Documento nao encontrado.' });
    if (await responderSeClienteNaoAcessivel(req, res, doc.ClienteId)) return;

    // Apagar ficheiro fisico se existir e pertencer a pasta de uploads.
    if (doc.caminho) {
      const ficheiro = path.resolve(__dirname, '../..', `.${doc.caminho}`);
      if (ficheiro.startsWith(uploadDir) && fs.existsSync(ficheiro)) {
        fs.unlinkSync(ficheiro);
      }
    }

    await registrarLog(
      req.user.email,
      'Remover Documento',
      `Documento "${doc.nome}" eliminado (id: ${doc.id}) do cliente ${doc.cliente?.email || doc.ClienteId}`
    );

    await doc.destroy();
    res.json({ mensagem: 'Documento eliminado.' });
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

module.exports = router;
