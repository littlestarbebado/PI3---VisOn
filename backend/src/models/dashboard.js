const { DataTypes } = require('sequelize');
const sequelize = require('./database');

// Modelo para as Áreas de Segurança
const SecurityArea = sequelize.define('security_area', {
  name: { type: DataTypes.STRING, allowNull: false },
  percentage: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: false });

// Modelo para os Documentos Recentes
const RecentDoc = sequelize.define('recent_doc', {
  title: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false }
}, { timestamps: false });

module.exports = { SecurityArea, RecentDoc };