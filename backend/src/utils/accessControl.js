const { Cliente } = require('../models');

function getRole(req) {
  return req.user?.role || req.admin?.role || req.user?.tipo || req.admin?.tipo;
}

function clienteWhereForUser(req, extra = {}) {
  const role = getRole(req);
  if (role === 'Gestor') {
    return { ...extra, GestorResponsavelId: req.user.id };
  }
  if (role === 'Cliente') {
    return { ...extra, id: req.user.id };
  }
  return extra;
}

function pedidoClienteWhereForUser(req) {
  const role = getRole(req);
  if (role === 'Gestor') return { GestorResponsavelId: req.user.id };
  if (role === 'Cliente') return { id: req.user.id };
  return {};
}

async function gestorPodeAcederCliente(req, clienteId) {
  const role = getRole(req);
  if (role === 'Admin') return true;
  if (role === 'Cliente') return Number(req.user.id) === Number(clienteId);
  if (role !== 'Gestor') return false;

  const cliente = await Cliente.findOne({
    where: { id: clienteId, GestorResponsavelId: req.user.id },
    attributes: ['id']
  });
  return Boolean(cliente);
}

async function responderSeClienteNaoAcessivel(req, res, clienteId) {
  const autorizado = await gestorPodeAcederCliente(req, clienteId);
  if (!autorizado) {
    res.status(403).json({ erro: 'Sem permissao para aceder a este cliente.' });
    return true;
  }
  return false;
}

module.exports = {
  getRole,
  clienteWhereForUser,
  pedidoClienteWhereForUser,
  gestorPodeAcederCliente,
  responderSeClienteNaoAcessivel
};
