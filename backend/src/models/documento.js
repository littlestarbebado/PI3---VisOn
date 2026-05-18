const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Documento', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  tipo: { type: DataTypes.STRING },
  caminho: { type: DataTypes.STRING },
  descricao: { type: DataTypes.TEXT }
});
