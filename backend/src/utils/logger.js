const { Log } = require('../models');

async function registrarLog(utilizador, acao, detalhes) {
  try {
    return await Log.create({
      utilizador: utilizador || 'Sistema',
      acao,
      detalhes
    });
  } catch (error) {
    console.error('Erro ao registar log de auditoria:', error);
    return null;
  }
}

module.exports = { registrarLog };
