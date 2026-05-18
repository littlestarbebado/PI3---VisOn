const router = require('express').Router();
const { Cliente, AtivoTecnologico, Documento } = require('../models');

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

module.exports = router;
