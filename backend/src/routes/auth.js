const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

// ROTA POST: /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailNormalizado = typeof email === 'string' ? email.trim().toLowerCase() : '';

    // 1. Verificar se o utilizador preencheu os campos
    if (!emailNormalizado || !password) {
      return res.status(400).json({ erro: 'Por favor, preencha todos os campos.' });
    }

    // 2. Procurar o Admin pelo email no Postgres
    const admin = await Admin.findOne({ where: { email: emailNormalizado } });
    if (!admin) {
      return res.status(401).json({ erro: 'Credenciais inválidas. Verifique o email.' });
    }

    // 3. Verificar se a password bate certo com o hash encriptado
    const passwordCorreta = await bcrypt.compare(password, admin.password);
    if (!passwordCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas. Verifique a password.' });
    }

    // 4. Gerar o Token JWT seguro (expira em 1 dia)
    const token = jwt.sign(
      { id: admin.id, email: admin.email, nome: admin.nome },
      process.env.JWT_SECRET || 'vison_secreto_super_protegido_2026',
      { expiresIn: '1d' }
    );

    // 5. Responder com sucesso e enviar os dados para o React guardar
    res.json({
      mensagem: 'Login efetuado com sucesso!',
      token,
      user: {
        nome: admin.nome,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ erro: 'Erro interno ao processar o login no servidor.' });
  }
});

module.exports = router;
