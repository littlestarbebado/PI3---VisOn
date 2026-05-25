const router = require('express').Router();
const { Cliente, AtivoTecnologico, Documento } = require('../models');

// 1. ROTA GET - Listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      order: [['nome', 'ASC']]
    });
    res.json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ erro: 'Erro interno ao aceder a lista de clientes.' });
  }
});

// 2. ROTA POST - Criar um novo cliente (Com ou sem Ativo inicial)
router.post('/', async (req, res) => {
  try {
    const { nome, responsavel, email, status, nomeAtivo, tipoAtivo, criticidadeAtivo } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'O nome da empresa cliente é obrigatório.' });
    }

    // Criar o Cliente no Postgres
    const novoCliente = await Cliente.create({
      nome,
      responsavel,
      email,
      status: status || 'Ativo'
    });

    // Se o utilizador preencheu um ativo no formulário, cria e associa ao ID do cliente
    if (nomeAtivo && AtivoTecnologico) {
      await AtivoTecnologico.create({
        nome: nomeAtivo,
        tipo: tipoAtivo || 'Não especificado',
        criticidade: criticidadeAtivo || 'Média',
        ClienteId: novoCliente.id
      });
    }

    res.status(201).json({ mensagem: 'Cliente registado com sucesso!', cliente: novoCliente });
  } catch (error) {
    console.error('Erro ao criar cliente no POST:', error);
    res.status(500).json({ erro: 'Erro interno ao salvar o cliente no PostgreSQL.' });
  }
});

// 3. ROTA GET - Buscar detalhes de 1 cliente específico
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: [
        { model: AtivoTecnologico, as: 'ativos' },
        { model: Documento, as: 'documentos' }
      ]
    });

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente nao encontrado.' });
    }

    res.json({
      cliente,
      ativos: cliente.ativos || [],
      documentos: cliente.documentos || []
    });
  } catch (error) {
    console.error('Erro ao procurar detalhes do cliente:', error);
    res.status(500).json({ erro: 'Erro interno ao aceder aos detalhes do cliente.' });
  }
});

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do armazenamento do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    // Garante que a pasta uploads existe no teu disco
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Guarda o ficheiro com o timestamp atual para evitar nomes duplicados
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 4. ROTA POST - Fazer upload de um PDF para um cliente específico
router.post('/:id/documentos', upload.single('pdf'), async (req, res) => {
  try {
    const clienteId = req.params.id;
    const { nome, descricao } = req.body;

    if (!req.file) {
      return res.status(400).json({ erro: 'Por favor, selecione um ficheiro PDF.' });
    }

    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }

    // Criar o registo do documento atrelado ao Cliente no Postgres
    const novoDocumento = await Documento.create({
      nome: nome || req.file.originalname,
      tipo: 'PDF',
      caminho: req.file.path.replace(/\\/g, '/'), // Normaliza as barras para a URL (/ em vez de \)
      descricao: descricao || 'Sem descrição.',
      ClienteId: clienteId
    });

    res.status(201).json({ mensagem: 'Documento enviado com sucesso!', documento: novoDocumento });
  } catch (error) {
    console.error('Erro ao fazer upload do documento:', error);
    res.status(500).json({ erro: 'Erro interno ao salvar o documento.' });
  }
});

module.exports = router;