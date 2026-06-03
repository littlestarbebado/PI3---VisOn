const router = require('express').Router();
const multer = require('multer');
const xlsx = require('xlsx');
const { AtivoTecnologico, Cliente } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;
const { registrarLog } = require('../utils/logger');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isXlsx = file.originalname.toLowerCase().endsWith('.xlsx');

    if (!isXlsx) {
      return cb(new Error('Apenas ficheiros .xlsx sao permitidos.'));
    }

    cb(null, true);
  }
});

function validarUpload(req, res, next) {
  upload.single('excel')(req, res, (error) => {
    if (error) {
      return res.status(400).json({ erro: error.message });
    }

    next();
  });
}

function normalizarChave(chave) {
  return String(chave || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function obterValor(linha, aliases) {
  const entradas = Object.entries(linha).reduce((acc, [chave, valor]) => {
    acc[normalizarChave(chave)] = valor;
    return acc;
  }, {});

  for (const alias of aliases) {
    const valor = entradas[normalizarChave(alias)];
    if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
      return String(valor).trim();
    }
  }

  return null;
}

router.post('/importar', auth, requireRole(['Cliente']), validarUpload, async (req, res) => {
  try {
    const ClienteId = req.user?.id;

    if (!ClienteId) {
      return res.status(401).json({ erro: 'Cliente autenticado nao identificado.' });
    }

    const cliente = await Cliente.findByPk(ClienteId);
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente autenticado nao encontrado.' });
    }

    if (!req.file) {
      return res.status(400).json({ erro: 'Ficheiro Excel obrigatorio.' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const primeiraFolha = workbook.SheetNames[0];

    if (!primeiraFolha) {
      return res.status(400).json({ erro: 'O ficheiro Excel nao contem folhas.' });
    }

    const linhas = xlsx.utils.sheet_to_json(workbook.Sheets[primeiraFolha], { defval: '' });
    const ativos = linhas
      .map(linha => ({
        nome: obterValor(linha, ['nome', 'nome do ativo', 'ativo', 'asset', 'name']),
        tipo: obterValor(linha, ['tipo', 'tipo do ativo', 'categoria', 'type']),
        criticidade: obterValor(linha, ['criticidade', 'critico', 'criticidade do ativo', 'criticality']),
        descricao: obterValor(linha, ['descricao', 'observacoes', 'description']),
        ClienteId
      }))
      .filter(ativo => ativo.nome);

    if (ativos.length === 0) {
      return res.status(400).json({ erro: 'Nao foram encontrados ativos validos no Excel.' });
    }

    const criados = await AtivoTecnologico.bulkCreate(ativos);
    await registrarLog(
      req.user?.email || cliente.email,
      'Upload Excel',
      `${criados.length} ativos importados`
    );

    res.status(201).json({
      mensagem: `${criados.length} ativos importados com sucesso.`,
      total: criados.length,
      ativos: criados
    });
  } catch (error) {
    console.error('Erro ao importar ativos tecnologicos:', error);
    res.status(500).json({ erro: error.message || 'Erro interno ao importar ativos.' });
  }
});

module.exports = router;
