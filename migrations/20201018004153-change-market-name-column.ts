import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, sequelize: typeof Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn('Markets', 'name', { type: sequelize.TEXT });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  down: async (queryInterface: QueryInterface, sequelize: typeof Sequelize) => {
    await queryInterface.changeColumn('Markets', 'name', { type: sequelize.STRING });
  }
};
