const router = require('express').Router();
const { ConteudoInstitucional } = require('../models');
const auth = require('../middlewares/auth');

// GET /api/conteudos — público, retorna todos os conteúdos
router.get('/', async (req, res) => {
  try {
    const conteudos = await ConteudoInstitucional.findAll();
    // Converte para objeto { chave: valor }
    const mapa = {};
    conteudos.forEach(c => { mapa[c.chave] = c.valor; });
    res.json(mapa);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// GET /api/conteudos/list — admin: lista completa com id, chave, secao
router.get('/list', auth, async (req, res) => {
  try {
    const conteudos = await ConteudoInstitucional.findAll({ order: [['secao', 'ASC'], ['chave', 'ASC']] });
    res.json(conteudos);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// PUT /api/conteudos/:id — admin: atualiza um conteúdo
router.put('/:id', auth, async (req, res) => {
  try {
    const c = await ConteudoInstitucional.findByPk(req.params.id);
    if (!c) return res.status(404).json({ erro: 'Não encontrado' });
    await c.update({ valor: req.body.valor });
    res.json(c);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// POST /api/conteudos — admin: criar novo conteúdo
router.post('/', auth, async (req, res) => {
  try {
    const c = await ConteudoInstitucional.create(req.body);
    res.status(201).json(c);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// POST /api/conteudos/seed — admin: seed inicial dos textos
router.post('/seed', auth, async (req, res) => {
  const defaults = [
    { chave: 'hero_titulo', valor: 'Proteja o Futuro Digital da sua Organização', secao: 'hero' },
    { chave: 'hero_subtitulo', valor: 'Soluções avançadas de cibersegurança para empresas que valorizam a proteção dos seus dados e sistemas.', secao: 'hero' },
    { chave: 'missao_texto', valor: 'A nossa missão é proteger as organizações portuguesas no espaço digital, fornecendo soluções de cibersegurança de excelência.', secao: 'sobre' },
    { chave: 'visao_texto', valor: 'Ser a referência nacional em cibersegurança, reconhecidos pela qualidade, inovação e confiança.', secao: 'sobre' },
    { chave: 'valores_texto', valor: 'Integridade, Excelência, Inovação, Confiança e Parceria.', secao: 'sobre' },
    { chave: 'stat_clientes', valor: '150+', secao: 'stats' },
    { chave: 'stat_pentests', valor: '500+', secao: 'stats' },
    { chave: 'stat_satisfacao', valor: '98%', secao: 'stats' },
    { chave: 'stat_anos', valor: '15+', secao: 'stats' },
  ];
  try {
    for (const d of defaults) await ConteudoInstitucional.findOrCreate({ where: { chave: d.chave }, defaults: d });
    res.json({ mensagem: 'Seed concluído' });
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

module.exports = router;
