// migrations/[timestamp]-create-registration.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('registrations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tournament_id: {
        type: Sequelize.INTEGER,
        references: { model: 'tournaments', key: 'id' },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      registered_at: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('registrations');
  }
};
