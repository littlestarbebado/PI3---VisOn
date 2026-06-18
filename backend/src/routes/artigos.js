const router = require('express').Router();
const { Artigo } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;
const { registrarLog } = require('../utils/logger');

// GET /api/artigos — público
router.get('/', async (req, res) => {
  try {
    const artigos = await Artigo.findAll({
      where: { publicado: true },
      order: [['dataPublicacao', 'DESC']],
      attributes: ['id', 'titulo', 'resumo', 'imagem', 'slug', 'dataPublicacao']
    });
    res.json(artigos);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// GET /api/artigos/admin — admin: todos
router.get('/admin', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const artigos = await Artigo.findAll({ order: [['createdAt', 'DESC']] });
    res.json(artigos);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// GET /api/artigos/:slug — público
router.get('/:slug', async (req, res) => {
  try {
    const artigo = await Artigo.findOne({ where: { slug: req.params.slug, publicado: true } });
    if (!artigo) return res.status(404).json({ erro: 'Artigo não encontrado' });
    res.json(artigo);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// POST /api/artigos — admin
router.post('/', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const slug = req.body.titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const artigo = await Artigo.create({ ...req.body, slug, dataPublicacao: req.body.publicado ? new Date() : null });

    await registrarLog(req.user.email, 'Criar Artigo', `Artigo criado: "${req.body.titulo}" (slug: ${slug})`);

    res.status(201).json(artigo);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// PUT /api/artigos/:id — admin
router.put('/:id', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const artigo = await Artigo.findByPk(req.params.id);
    if (!artigo) return res.status(404).json({ erro: 'Não encontrado' });
    if (req.body.publicado && !artigo.dataPublicacao) req.body.dataPublicacao = new Date();
    await artigo.update(req.body);

    await registrarLog(req.user.email, 'Editar Artigo', `Artigo editado: "${artigo.titulo}" (id: ${req.params.id})`);

    res.json(artigo);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// DELETE /api/artigos/:id — admin
router.delete('/:id', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const artigo = await Artigo.findByPk(req.params.id);
    if (!artigo) return res.status(404).json({ erro: 'Não encontrado' });

    await registrarLog(req.user.email, 'Remover Artigo', `Artigo eliminado: "${artigo.titulo}" (id: ${req.params.id})`);

    await Artigo.destroy({ where: { id: req.params.id } });
    res.json({ mensagem: 'Artigo eliminado' });
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

module.exports = router;
