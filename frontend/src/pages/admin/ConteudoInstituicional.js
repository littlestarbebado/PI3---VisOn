const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('ConteudoInstitucional', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  chave: { type: DataTypes.STRING, allowNull: false, unique: true },
  valor: { type: DataTypes.TEXT, allowNull: false },
  secao: { type: DataTypes.STRING, allowNull: false }
});