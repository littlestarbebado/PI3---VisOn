const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Artigo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  resumo: { type: DataTypes.TEXT },
  conteudo: { type: DataTypes.TEXT, allowNull: false },
  imagem: { type: DataTypes.STRING },
  slug: { type: DataTypes.STRING, unique: true },
  publicado: { type: DataTypes.BOOLEAN, defaultValue: false },
  dataPublicacao: { type: DataTypes.DATE }
});
