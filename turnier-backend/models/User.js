'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init({
    username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    displayname: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM('ADMIN', 'PLAYER'), defaultValue: 'PLAYER' },
    discord_name: DataTypes.STRING(100),
    tiktok_name: DataTypes.STRING(100),
    mobile: DataTypes.STRING(20)
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true
  });

  // PASSWORD HASHING HOOK
  User.beforeCreate(async (user) => {
    user.password_hash = await bcrypt.hash(user.password_hash, 12);
  });

  return User;
};
