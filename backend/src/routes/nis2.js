const router = require('express').Router();
const { Op } = require('sequelize');
const { NIS2Assessment, Cliente, Documento } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;
const { registrarLog } = require('../utils/logger');

const ESTADOS = ['Nao Iniciado', 'Em Analise', 'Conforme', 'Nao Conforme'];

async function respostaAvaliacao(avaliacao) {
  if (!avaliacao) return { avaliacao: null, evidencias: [] };

  const ids = Array.isArray(avaliacao.evidenciasIds) ? avaliacao.evidenciasIds : [];
  const evidencias = ids.length
    ? await Documento.findAll({
      where: { id: { [Op.in]: ids }, ClienteId: avaliacao.ClienteId },
      order: [['createdAt', 'DESC']]
    })
    : [];

  return { avaliacao, evidencias };
}

// Cliente consulta a sua avaliação; Gestor/Admin consulta por clienteId.
router.get('/', auth, requireRole(['Cliente', 'Gestor', 'Admin']), async (req, res) => {
  try {
    const clienteId = req.user.role === 'Cliente' ? req.user.id : req.query.clienteId;
    if (!clienteId) return res.status(400).json({ erro: 'clienteId obrigatorio.' });

    const avaliacao = await NIS2Assessment.findOne({ where: { ClienteId: clienteId } });
    res.json(await respostaAvaliacao(avaliacao));
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao carregar avaliacao NIS2.' });
  }
});

// Gestor/Admin cria ou atualiza a avaliação de um cliente.
router.put('/:clienteId', auth, requireRole(['Gestor', 'Admin']), async (req, res) => {
  try {
    const clienteId = Number(req.params.clienteId);
    const { estado, observacoes } = req.body;
    const percentagem = Number(req.body.percentagem);
    const idsPedidos = Array.isArray(req.body.evidenciasIds)
      ? req.body.evidenciasIds.map(Number).filter(Number.isInteger)
      : [];

    if (!ESTADOS.includes(estado)) return res.status(400).json({ erro: 'Estado NIS2 invalido.' });
    if (!Number.isInteger(percentagem) || percentagem < 0 || percentagem > 100) {
      return res.status(400).json({ erro: 'Percentagem deve estar entre 0 e 100.' });
    }

    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) return res.status(404).json({ erro: 'Cliente nao encontrado.' });

    const documentos = idsPedidos.length
      ? await Documento.findAll({ where: { id: { [Op.in]: idsPedidos }, ClienteId: clienteId } })
      : [];
    const evidenciasIds = documentos.map(documento => documento.id);

    const [avaliacao] = await NIS2Assessment.findOrCreate({
      where: { ClienteId: clienteId },
      defaults: { estado, percentagem, observacoes, evidenciasIds }
    });
    await avaliacao.update({ estado, percentagem, observacoes, evidenciasIds });

    await registrarLog(req.user.email, 'Avaliacao NIS2', `Cliente ${cliente.email}: ${estado} (${percentagem}%)`);
    res.json(await respostaAvaliacao(avaliacao));
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao guardar avaliacao NIS2.' });
  }
});

module.exports = router;
