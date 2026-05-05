const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('ConteudoInstitucional', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  chave: { type: DataTypes.STRING, allowNull: false, unique: true },
  // e.g. "hero_titulo", "hero_subtitulo", "missao_texto", "visao_texto"
  valor: { type: DataTypes.TEXT, allowNull: false },
  secao: { type: DataTypes.STRING, allowNull: false }
  // e.g. "hero", "sobre", "missao", "visao", "valores"
});
