const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Cliente', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  responsavel: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Ativo' }
});
