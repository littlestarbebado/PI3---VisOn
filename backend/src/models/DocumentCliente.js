const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Document = sequelize.define('document', {
  title: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // PDF, etc.
  size: { type: DataTypes.STRING, allowNull: false }, // 2.4 MB, etc.
  tag: { type: DataTypes.STRING, allowNull: false },  // Relatório, Documentação, PentTest
  uploadedBy: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false }
}, { timestamps: false });

module.exports = Document;