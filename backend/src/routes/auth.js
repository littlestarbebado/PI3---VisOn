const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const SECRET = process.env.JWT_SECRET || 'vison_secret_2024';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return res.status(401).json({ erro: 'Credenciais inválidas' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET, { expiresIn: '8h' });
    res.json({ token, admin: { id: admin.id, nome: admin.nome, email: admin.email } });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// GET /api/auth/me
const auth = require('../middlewares/auth');
router.get('/me', auth, async (req, res) => {
  const admin = await Admin.findByPk(req.admin.id, { attributes: { exclude: ['password'] } });
  res.json(admin);
});

module.exports = router;
