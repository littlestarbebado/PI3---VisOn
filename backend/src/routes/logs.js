const router = require('express').Router();
const { Log } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;

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
