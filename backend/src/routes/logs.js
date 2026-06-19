const router = require('express').Router();
const { Op } = require('sequelize');
const { Log } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;

router.get('/stats', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const agora = new Date();
    const hoje = new Date(agora); hoje.setHours(0, 0, 0, 0);
    const semana = new Date(hoje); semana.setDate(semana.getDate() - 6);
    const mes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const [total, atividadeHoje, estaSemana, esteMes] = await Promise.all([
      Log.count(),
      Log.count({ where: { createdAt: { [Op.gte]: hoje } } }),
      Log.count({ where: { createdAt: { [Op.gte]: semana } } }),
      Log.count({ where: { createdAt: { [Op.gte]: mes } } })
    ]);
    res.json({ total, atividadeHoje, estaSemana, esteMes });
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao calcular estatisticas de atividade.' });
  }
});

router.get('/', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    res.json(logs);
  } catch (error) {
    console.error('Erro ao listar logs:', error);
    res.status(500).json({ erro: 'Erro interno ao listar logs.' });
  }
});

module.exports = router;
