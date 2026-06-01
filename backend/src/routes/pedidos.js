const router = require('express').Router();
const { Pedido, MensagemPedido, Cliente } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;

const ESTADOS = ['Pendente', 'Em Análise', 'Concluído'];

function getRole(req) {
  return req.user?.role || req.admin?.role || req.user?.tipo || req.admin?.tipo;
}

function getEnviadoPor(role) {
  if (role === 'Admin') return 'Admin';
  if (role === 'Gestor') return 'Gestor';
  return 'Cliente';
}

async function findPedidoForUser(req, res) {
  const role = getRole(req);
  const pedido = await Pedido.findByPk(req.params.id, {
    include: [
      { model: MensagemPedido, as: 'mensagens', order: [['createdAt', 'ASC']] },
      { model: Cliente, as: 'cliente', attributes: ['id', 'nome', 'email'] }
    ]
  });

  if (!pedido) {
    res.status(404).json({ erro: 'Pedido nao encontrado.' });
    return null;
  }

  if (role === 'Cliente' && pedido.ClienteId !== req.user.id) {
    res.status(403).json({ erro: 'Sem permissao para aceder a este pedido.' });
    return null;
  }

  return pedido;
}

// POST /api/pedidos - cliente cria um novo pedido
router.post('/', auth, requireRole(['Cliente']), async (req, res) => {
  try {
    const { titulo, descricao } = req.body;

    if (!titulo || !descricao) {
      return res.status(400).json({ erro: 'Titulo e descricao sao obrigatorios.' });
    }

    const pedido = await Pedido.create({
      titulo,
      descricao,
      ClienteId: req.user.id
    });

    await MensagemPedido.create({
      texto: descricao,
      enviadoPor: 'Cliente',
      PedidoId: pedido.id
    });

    const pedidoCompleto = await Pedido.findByPk(pedido.id, {
      include: [
        { model: MensagemPedido, as: 'mensagens' },
        { model: Cliente, as: 'cliente', attributes: ['id', 'nome', 'email'] }
      ]
    });

    res.status(201).json(pedidoCompleto);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ erro: 'Erro interno ao criar pedido.' });
  }
});

// GET /api/pedidos - cliente ve os seus; gestor/admin ve todos ou filtra por clienteId
router.get('/', auth, requireRole(['Cliente', 'Gestor', 'Admin']), async (req, res) => {
  try {
    const role = getRole(req);
    const where = {};

    if (role === 'Cliente') {
      where.ClienteId = req.user.id;
    } else if (req.query.clienteId) {
      where.ClienteId = req.query.clienteId;
    }

    const pedidos = await Pedido.findAll({
      where,
      include: [
        { model: MensagemPedido, as: 'mensagens' },
        { model: Cliente, as: 'cliente', attributes: ['id', 'nome', 'email'] }
      ],
      order: [
        ['updatedAt', 'DESC'],
        [{ model: MensagemPedido, as: 'mensagens' }, 'createdAt', 'ASC']
      ]
    });

    res.json(pedidos);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ erro: 'Erro interno ao listar pedidos.' });
  }
});

// POST /api/pedidos/:id/mensagens - envia mensagem no chat de um pedido
router.post('/:id/mensagens', auth, requireRole(['Cliente', 'Gestor', 'Admin']), async (req, res) => {
  try {
    const { texto } = req.body;
    if (!texto) return res.status(400).json({ erro: 'Texto da mensagem e obrigatorio.' });

    const pedido = await findPedidoForUser(req, res);
    if (!pedido) return;

    const role = getRole(req);
    const mensagem = await MensagemPedido.create({
      texto,
      enviadoPor: getEnviadoPor(role),
      PedidoId: pedido.id
    });

    await pedido.update({ updatedAt: new Date() });
    res.status(201).json(mensagem);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ erro: 'Erro interno ao enviar mensagem.' });
  }
});

// PUT /api/pedidos/:id/estado - gestor/admin altera o estado
router.put('/:id/estado', auth, requireRole(['Gestor', 'Admin']), async (req, res) => {
  try {
    const { estado } = req.body;
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({ erro: 'Estado invalido.' });
    }

    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ erro: 'Pedido nao encontrado.' });

    await pedido.update({ estado });
    res.json(pedido);
  } catch (error) {
    console.error('Erro ao atualizar estado do pedido:', error);
    res.status(500).json({ erro: 'Erro interno ao atualizar estado do pedido.' });
  }
});

module.exports = router;
