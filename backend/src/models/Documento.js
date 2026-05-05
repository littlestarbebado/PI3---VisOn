const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Documento = sequelize.define('Documento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nomeFicheiro: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  caminho: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('PenTest', 'PoliticaInterna', 'Evidencia', 'Outro'),
    allowNull: false,
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'documentos',
  timestamps: true,
});

module.exports = Documento;