const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Pedido', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: false },
  estado: {
    type: DataTypes.ENUM('Pendente', 'Em Análise', 'Concluído'),
    defaultValue: 'Pendente',
    allowNull: false
  }
});
