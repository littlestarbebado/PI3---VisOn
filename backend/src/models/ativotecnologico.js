const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('AtivoTecnologico', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  tipo: { type: DataTypes.STRING },
  criticidade: { type: DataTypes.STRING },
  descricao: { type: DataTypes.TEXT }
});
