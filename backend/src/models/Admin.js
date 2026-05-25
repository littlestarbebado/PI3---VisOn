const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  telefone: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'Gestor' }
});