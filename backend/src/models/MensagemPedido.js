const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('MensagemPedido', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  texto: { type: DataTypes.TEXT, allowNull: false },
  enviadoPor: {
    type: DataTypes.ENUM('Cliente', 'Gestor', 'Admin'),
    allowNull: false
  },
  lidaPorCliente: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
  lidaPorEquipa: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false }
});
