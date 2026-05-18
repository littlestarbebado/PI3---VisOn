const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('MensagemContacto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  telefone: { type: DataTypes.STRING },
  empresa: { type: DataTypes.STRING },
  mensagem: { type: DataTypes.TEXT, allowNull: false },
  lida: { type: DataTypes.BOOLEAN, defaultValue: false }
});
