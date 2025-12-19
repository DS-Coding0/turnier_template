'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tournaments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      mode: {
        type: Sequelize.ENUM('KO', 'ROUND_ROBIN'),
        defaultValue: 'KO'
      },
      max_players: {
        type: Sequelize.INTEGER,
        defaultValue: 16
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('DRAFT', 'ACTIVE', 'FINISHED'),
        defaultValue: 'DRAFT'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      prizes: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tournaments');
  }
};
