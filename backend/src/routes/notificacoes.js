const router = require('express').Router();
const { Op } = require('sequelize');
const { Pedido, MensagemPedido, Cliente } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;
const { pedidoClienteWhereForUser } = require('../utils/accessControl');

function getRole(req) {
  return req.user?.role || req.admin?.role || req.user?.tipo || req.admin?.tipo;
}

function notificationWhereForRole(role) {
  if (role === 'Cliente') {
    return {
      enviadoPor: { [Op.ne]: 'Cliente' },
      lidaPorCliente: false
    };
  }

  return {
    enviadoPor: 'Cliente',
    lidaPorEquipa: false
  };
}

function pedidoWhereForUser(req) {
  const role = getRole(req);
  if (role === 'Cliente') return { ClienteId: req.user.id };
  return {};
}

function remetenteLabel(mensagem) {
  if (mensagem.enviadoPor === 'Cliente') return mensagem.pedido?.cliente?.nome || 'Cliente';
  return mensagem.enviadoPor;
}

router.get('/', auth, requireRole(['Cliente', 'Gestor', 'Admin']), async (req, res) => {
  try {
    const role = getRole(req);
    const include = [{
        model: Pedido,
        as: 'pedido',
        where: pedidoWhereForUser(req),
        include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nome', 'email', 'GestorResponsavelId'], where: pedidoClienteWhereForUser(req) }]
      }];

    const [total, mensagens] = await Promise.all([
      MensagemPedido.count({ where: notificationWhereForRole(role), include }),
      MensagemPedido.findAll({
      where: notificationWhereForRole(role),
      include,
      order: [['createdAt', 'DESC']],
      limit: 10
      })
    ]);

    const items = mensagens.map(mensagem => ({
      tipo: 'pedido',
      pedidoId: mensagem.PedidoId,
      clienteId: mensagem.pedido?.ClienteId || mensagem.pedido?.cliente?.id || null,
      titulo: mensagem.pedido?.titulo || `Pedido #${mensagem.PedidoId}`,
      mensagem: mensagem.texto,
      criadoEm: mensagem.createdAt,
      remetente: remetenteLabel(mensagem)
    }));

    res.json({ total, items });
  } catch (error) {
    console.error('Erro ao carregar notificacoes:', error);
    res.status(500).json({ erro: 'Erro interno ao carregar notificacoes.' });
  }
});

router.post('/marcar-lidas', auth, requireRole(['Cliente', 'Gestor', 'Admin']), async (req, res) => {
  try {
    const role = getRole(req);
    const mensagens = await MensagemPedido.findAll({
      attributes: ['id'],
      where: notificationWhereForRole(role),
      include: [{
        model: Pedido,
        as: 'pedido',
        attributes: ['id', 'ClienteId'],
        where: pedidoWhereForUser(req),
        include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'GestorResponsavelId'], where: pedidoClienteWhereForUser(req) }]
      }]
    });

    const ids = mensagens.map(mensagem => mensagem.id);
    if (ids.length > 0) {
      await MensagemPedido.update(
        role === 'Cliente' ? { lidaPorCliente: true } : { lidaPorEquipa: true },
        { where: { id: ids } }
      );
    }

    res.json({ mensagem: 'Notificacoes marcadas como lidas.', total: 0 });
  } catch (error) {
    console.error('Erro ao marcar notificacoes:', error);
    res.status(500).json({ erro: 'Erro interno ao marcar notificacoes.' });
  }
});

module.exports = router;
