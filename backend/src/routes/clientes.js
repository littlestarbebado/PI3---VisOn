const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { Cliente, AtivoTecnologico, Documento } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;

// GET /api/clientes - listar todos (protegido)
router.get('/', auth, requireRole(['Admin', 'Gestor']), async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      attributes: { exclude: ['password'] },
      order: [['nome', 'ASC']]
    });
    res.json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ erro: 'Erro interno ao aceder a lista de clientes.' });
  }
});

// GET /api/clientes/:id - detalhes de um cliente (protegido)
router.get('/:id', auth, requireRole(['Admin', 'Gestor']), async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
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

// POST /api/clientes - criar novo cliente (protegido)
router.post('/', auth, requireRole(['Admin', 'Gestor']), async (req, res) => {
  try {
    const {
      nome,
      email,
      telefone,
      password,
      status,
      respSegurancaNome,
      respSegurancaEmail,
      respSegurancaTelefone,
      contactoPermNome,
      contactoPermEmail,
      contactoPermTelefone,
      responsavel,
      nomeAtivo,
      tipoAtivo,
      criticidadeAtivo
    } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ erro: 'Nome, email e password sao obrigatorios.' });
    }

    const existe = await Cliente.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ erro: 'Ja existe um cliente com este email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const cliente = await Cliente.create({
      nome,
      email,
      telefone,
      password: hashedPassword,
      status: typeof status === 'boolean' ? status : true,
      respSegurancaNome: respSegurancaNome || responsavel,
      respSegurancaEmail,
      respSegurancaTelefone,
      contactoPermNome,
      contactoPermEmail,
      contactoPermTelefone
    });

    if (nomeAtivo) {
      await AtivoTecnologico.create({
        nome: nomeAtivo,
        tipo: tipoAtivo,
        criticidade: criticidadeAtivo,
        ClienteId: cliente.id
      });
    }

    const clienteSemPassword = cliente.toJSON();
    delete clienteSemPassword.password;

    res.status(201).json({ mensagem: 'Cliente criado com sucesso.', cliente: clienteSemPassword });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ erro: 'Erro interno ao criar cliente.' });
  }
});

// PUT /api/clientes/:id - atualizar cliente (protegido)
router.put('/:id', auth, requireRole(['Admin', 'Gestor']), async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente nao encontrado.' });
    }

    const dados = { ...req.body };
    if (dados.password) {
      dados.password = await bcrypt.hash(dados.password, 10);
    }

    await cliente.update(dados);

    const clienteSemPassword = cliente.toJSON();
    delete clienteSemPassword.password;

    res.json({ mensagem: 'Cliente atualizado com sucesso.', cliente: clienteSemPassword });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ erro: 'Erro interno ao atualizar cliente.' });
  }
});

// DELETE /api/clientes/:id - eliminar cliente (protegido)
router.delete('/:id', auth, requireRole(['Admin', 'Gestor']), async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);

    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente nao encontrado.' });
    }

    await cliente.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao eliminar cliente:', error);
    res.status(500).json({ erro: 'Erro interno ao eliminar cliente.' });
  }
});

module.exports = router;
