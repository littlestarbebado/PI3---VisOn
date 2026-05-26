const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Cliente', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  // Dados da Empresa
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  telefone: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING, allowNull: false },
  score: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.BOOLEAN, defaultValue: true },

  // Responsavel de Seguranca
  respSegurancaNome: { type: DataTypes.STRING },
  respSegurancaEmail: { type: DataTypes.STRING },
  respSegurancaTelefone: { type: DataTypes.STRING },

  // Contacto Permanente
  contactoPermNome: { type: DataTypes.STRING },
  contactoPermEmail: { type: DataTypes.STRING },
  contactoPermTelefone: { type: DataTypes.STRING }
});
