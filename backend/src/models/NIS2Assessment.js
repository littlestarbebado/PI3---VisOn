const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('NIS2Assessment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  estado: { type: DataTypes.STRING, defaultValue: 'Nao Iniciado', allowNull: false },
  percentagem: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
  observacoes: { type: DataTypes.TEXT },
  evidenciasIds: { type: DataTypes.JSONB, defaultValue: [], allowNull: false },
  ClienteId: { type: DataTypes.INTEGER, allowNull: false, unique: true }
});
