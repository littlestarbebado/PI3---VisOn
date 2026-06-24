const router = require('express').Router();
const { Incidente, Cliente } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;
const { registrarLog } = require('../utils/logger');
const { pedidoClienteWhereForUser } = require('../utils/accessControl');

const ESTADOS = ['Pendente', 'Em Analise', 'Resolvido'];

function getRole(req) {
  return req.user?.role || req.admin?.role || req.user?.tipo || req.admin?.tipo;
}

function normalizarEstado(estado) {
  if (estado === 'Em Análise') return 'Em Analise';
  return estado;
}

// POST /api/incidentes - cliente submete um incidente CNCS
router.post('/', auth, requireRole(['Cliente']), async (req, res) => {
  try {
    const { tipo, dataOcorrencia, impacto, descricao, acoesImediatas } = req.body;

    if (!tipo || !dataOcorrencia || !impacto || !descricao) {
      return res.status(400).json({ erro: 'Tipo, data/hora, impacto e descricao sao obrigatorios.' });
    }

    const cliente = await Cliente.findByPk(req.user.id);
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente autenticado nao encontrado.' });
    }

    const incidente = await Incidente.create({
      tipo,
      dataOcorrencia,
      impacto,
      descricao,
      acoesImediatas,
      ClienteId: req.user.id
    });

    await registrarLog(
      req.user?.email || cliente.email,
      'Report Incidente',
      `Incidente do tipo ${tipo} submetido`
    );

    const completo = await Incidente.findByPk(incidente.id, {
      include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nome', 'email'] }]
    });

    res.status(201).json(completo);
  } catch (error) {
    console.error('Erro ao submeter incidente:', error);
    res.status(500).json({ erro: 'Erro interno ao submeter incidente.' });
  }
});

// GET /api/incidentes - cliente ve os seus; admin/gestor ve todos ou filtra por clienteId
router.get('/', auth, requireRole(['Cliente', 'Gestor', 'Admin']), async (req, res) => {
  try {
    const role = getRole(req);
    const where = {};

    if (role === 'Cliente') {
      where.ClienteId = req.user.id;
    } else if (role === 'Admin' && req.query.clienteId) {
      where.ClienteId = req.query.clienteId;
    } else if (role === 'Gestor' && req.query.clienteId) {
      where.ClienteId = req.query.clienteId;
    }

    const incidentes = await Incidente.findAll({
      where,
      include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nome', 'email', 'GestorResponsavelId'], where: pedidoClienteWhereForUser(req) }],
      order: [['createdAt', 'DESC']]
    });

    res.json(incidentes);
  } catch (error) {
    console.error('Erro ao listar incidentes:', error);
    res.status(500).json({ erro: 'Erro interno ao listar incidentes.' });
  }
});

// PUT /api/incidentes/:id/estado - gestor/admin altera estado
router.put('/:id/estado', auth, requireRole(['Gestor', 'Admin']), async (req, res) => {
  try {
    const estado = normalizarEstado(req.body.estado);

    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({ erro: 'Estado invalido.' });
    }

    const incidente = await Incidente.findByPk(req.params.id, {
      include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nome', 'email', 'GestorResponsavelId'] }]
    });
    if (!incidente) {
      return res.status(404).json({ erro: 'Incidente nao encontrado.' });
    }
    if (getRole(req) === 'Gestor' && Number(incidente.cliente?.GestorResponsavelId) !== Number(req.user.id)) {
      return res.status(403).json({ erro: 'Sem permissao para aceder a este incidente.' });
    }

    await incidente.update({ estado });
    await registrarLog(
      req.user?.email || req.admin?.email,
      'Alteracao de Incidente',
      `Incidente #${incidente.id} movido para ${estado}`
    );

    res.json(incidente);
  } catch (error) {
    console.error('Erro ao atualizar estado do incidente:', error);
    res.status(500).json({ erro: 'Erro interno ao atualizar estado do incidente.' });
  }
});

module.exports = router;
