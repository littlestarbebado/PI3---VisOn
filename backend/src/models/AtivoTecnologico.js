const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const AtivoTecnologico = sequelize.define('AtivoTecnologico', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nomeAtivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING, // Ex: Servidor, PC, Switch, Firewall
    allowNull: false,
  },
  criticidade: {
    type: DataTypes.ENUM('Baixa', 'Média', 'Alta', 'Crítica'),
    allowNull: false,
    defaultValue: 'Média',
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Este ID vai ligar o ativo ao cliente criado pelo Kuka
  }
}, {
  tableName: 'ativos_tecnologicos',
  timestamps: true,
});

module.exports = AtivoTecnologico;