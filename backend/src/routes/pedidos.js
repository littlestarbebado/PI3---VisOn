const router = require('express').Router();
const { Pedido, MensagemPedido, Cliente } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;
const { registrarLog } = require('../utils/logger');

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

// POST /api/pedidos — cliente cria pedido (submissão)
router.post('/', auth, requireRole(['Cliente']), async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    if (!titulo || !descricao) {
      return res.status(400).json({ erro: 'Titulo e descricao sao obrigatorios.' });
    }

    const pedido = await Pedido.create({ titulo, descricao, ClienteId: req.user.id });

    await MensagemPedido.create({
      texto: descricao,
      enviadoPor: 'Cliente',
      PedidoId: pedido.id,
      lidaPorCliente: true,
      lidaPorEquipa: false
    });

    await registrarLog(req.user.email, 'Submissao Pedido', `Cliente ${req.user.email} submeteu pedido: "${titulo}" (id: ${pedido.id})`);

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

// GET /api/pedidos
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
      order: [['updatedAt', 'DESC'], [{ model: MensagemPedido, as: 'mensagens' }, 'createdAt', 'ASC']]
    });

    res.json(pedidos);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ erro: 'Erro interno ao listar pedidos.' });
  }
});

// POST /api/pedidos/:id/mensagens
router.post('/:id/mensagens', auth, requireRole(['Cliente', 'Gestor', 'Admin']), async (req, res) => {
  try {
    const { texto } = req.body;
    if (!texto) return res.status(400).json({ erro: 'Texto da mensagem e obrigatorio.' });

    const pedido = await findPedidoForUser(req, res);
    if (!pedido) return;

    const role = getRole(req);
    const enviadoPor = getEnviadoPor(role);
    const mensagem = await MensagemPedido.create({
      texto,
      enviadoPor,
      PedidoId: pedido.id,
      lidaPorCliente: enviadoPor === 'Cliente',
      lidaPorEquipa: enviadoPor !== 'Cliente'
    });

    await pedido.update({ updatedAt: new Date() });
    req.app.get('io')?.to(`pedido_${pedido.id}`).emit('receber_mensagem', mensagem);
    req.app.get('io')?.emit('notificacoes_atualizadas');
    res.status(201).json(mensagem);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ erro: 'Erro interno ao enviar mensagem.' });
  }
});

// PUT /api/pedidos/:id/estado
router.put('/:id/estado', auth, requireRole(['Gestor', 'Admin']), async (req, res) => {
  try {
    const { estado } = req.body;
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({ erro: 'Estado invalido.' });
    }

    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ erro: 'Pedido nao encontrado.' });

    await pedido.update({ estado });
    await registrarLog(req.user?.email || req.admin?.email, 'Alteracao de Estado', `Pedido #${pedido.id} movido para ${estado}`);
    res.json(pedido);
  } catch (error) {
    console.error('Erro ao atualizar estado do pedido:', error);
    res.status(500).json({ erro: 'Erro interno ao atualizar estado do pedido.' });
  }
});

module.exports = router;
