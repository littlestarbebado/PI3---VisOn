const router = require('express').Router();
const { MensagemContacto } = require('../models');
const auth = require('../middlewares/auth');
const { registrarLog } = require('../utils/logger');

// POST /api/contacto — público (submissão de contacto)
router.post('/', async (req, res) => {
  try {
    const msg = await MensagemContacto.create(req.body);

    await registrarLog(req.body.email || 'Público', 'Submissao Contacto', `Nova mensagem de contacto recebida de: ${req.body.nome || 'Desconhecido'} (${req.body.email || '-'})`);

    res.status(201).json({ mensagem: 'Mensagem enviada com sucesso!', id: msg.id });
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// GET /api/contacto — admin
router.get('/', auth, async (req, res) => {
  try {
    const msgs = await MensagemContacto.findAll({ order: [['createdAt', 'DESC']] });
    res.json(msgs);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// PUT /api/contacto/:id/lida — admin
router.put('/:id/lida', auth, async (req, res) => {
  try {
    const msg = await MensagemContacto.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ erro: 'Não encontrada' });
    await msg.update({ lida: true });
    res.json(msg);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// DELETE /api/contacto/:id — admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await MensagemContacto.destroy({ where: { id: req.params.id } });
    res.json({ mensagem: 'Eliminada' });
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

module.exports = router;
