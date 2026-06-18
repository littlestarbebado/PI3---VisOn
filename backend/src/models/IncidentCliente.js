const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Incident = sequelize.define('incident', {
  title: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false }, // "Resolvido" ou "Em Investigação"
  date: { type: DataTypes.DATEONLY, allowNull: false }
}, { timestamps: false });

module.exports = Incident;