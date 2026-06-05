const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Incidente', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo: { type: DataTypes.STRING, allowNull: false },
  dataOcorrencia: { type: DataTypes.DATE, allowNull: false },
  impacto: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: false },
  acoesImediatas: { type: DataTypes.TEXT },
  estado: { type: DataTypes.STRING, defaultValue: 'Pendente', allowNull: false }
});
