const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Log', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  utilizador: { type: DataTypes.STRING, allowNull: false },
  acao: { type: DataTypes.STRING, allowNull: false },
  detalhes: { type: DataTypes.TEXT, allowNull: false }
}, {
  timestamps: true,
  updatedAt: false
});
