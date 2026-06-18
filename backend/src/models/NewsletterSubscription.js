const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('NewsletterSubscription', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true }
});
