const router = require('express').Router();
const { Cliente, AtivoTecnologico, Documento } = require('../models');
const auth = require('../middlewares/auth');

// GET /api/clientes — listar todos (protegido)
router.get('/', auth, async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      order: [['nome', 'ASC']]
    });
    res.json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ erro: 'Erro interno ao aceder à lista de clientes.' });
  }
});

// GET /api/clientes/:id — detalhes de um cliente (protegido)
router.get('/:id', auth, async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: [
        { model: AtivoTecnologico, as: 'ativos' },
        { model: Documento, as: 'documentos' }
      ]
    });

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
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

// POST /api/clientes — criar novo cliente (protegido)
router.post('/', auth, async (req, res) => {
  try {
    const { nome, responsavel, email, status } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'O campo nome é obrigatório.' });
    }

    const cliente = await Cliente.create({ nome, responsavel, email, status });
    res.status(201).json({ mensagem: 'Cliente criado com sucesso.', cliente });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ erro: 'Erro interno ao criar cliente.' });
  }
});

// PUT /api/clientes/:id — atualizar cliente (protegido)
router.put('/:id', auth, async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }

    await cliente.update(req.body);
    res.json({ mensagem: 'Cliente atualizado com sucesso.', cliente });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ erro: 'Erro interno ao atualizar cliente.' });
  }
});

// DELETE /api/clientes/:id — eliminar cliente (protegido)
router.delete('/:id', auth, async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }

    await cliente.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao eliminar cliente:', error);
    res.status(500).json({ erro: 'Erro interno ao eliminar cliente.' });
  }
});

module.exports = router;