'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Registration extends Model {}

  Registration.init({
    tournament_id: {
      type: DataTypes.INTEGER,
      references: { model: 'tournaments', key: 'id' }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' }
    },
    registered_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    modelName: 'Registration',
    timestamps: false
  });

  return Registration;
};
