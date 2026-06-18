const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'vison_secret_2024';

async function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token nao fornecido' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    req.admin = decoded;

    // Enforcement: verificar se o utilizador Admin/Gestor ainda está ativo
    if (decoded.role === 'Admin' || decoded.role === 'Gestor') {
      const { Admin } = require('../models');
      const utilizador = await Admin.findByPk(decoded.id, { attributes: ['id', 'ativo'] });
      if (!utilizador || utilizador.ativo === false) {
        return res.status(403).json({ erro: 'Conta suspensa. Acesso revogado.' });
      }
    }

    next();
  } catch {
    res.status(401).json({ erro: 'Token invalido' });
  }
}

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    const role = req.user?.role || req.admin?.role || req.user?.tipo || req.admin?.tipo;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ erro: 'Acesso negado. Nível de permissão insuficiente.' });
    }
    next();
  };
}

auth.requireRole = requireRole;

module.exports = auth;
