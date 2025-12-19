'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tournament extends Model {}
  
  Tournament.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: DataTypes.TEXT,
    mode: DataTypes.ENUM('KO', 'ROUND_ROBIN'),
    max_players: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    status: DataTypes.ENUM('DRAFT', 'ACTIVE', 'FINISHED'),
    created_by: DataTypes.INTEGER,
    created_at: DataTypes.DATE,  // ✅ Nur wenn vorhanden!
    // updated_at: ?  ← Nur wenn in DB!
    prizes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tournament',
    tableName: 'Tournaments',
    timestamps: false,
    underscored: true
  });
  
  return Tournament;
};
