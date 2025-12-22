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
    status: DataTypes.ENUM('DRAFT', 'OPENED', 'ACTIVE', 'FINISHED'),
    created_by: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    prizes: DataTypes.TEXT,
    
    // 🔥 NEU: SPIELER + BRACKET + STANDINGS
    players: DataTypes.JSON, // [{"id":1,"userId":2,"name":"DS-Coding"},...]
    matches: DataTypes.JSON, // KO: [{"round":1,"matchId":1,"player1":1,"player2":2,"score1":null}]
    standings: DataTypes.JSON // Round Robin: [{"playerId":1,"wins":0,"points":0}]
  }, {
    sequelize,
    modelName: 'Tournament',
    tableName: 'Tournaments',
    timestamps: false,
    underscored: true
  });
  
  return Tournament;
};
