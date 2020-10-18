import Sequelize, { QueryInterface } from "sequelize";
import { IRoles } from "src/interfaces/role";

module.exports = {
  up: async (queryInterface: QueryInterface, sequelize: typeof Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
      await queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          primaryKey: true,
          defaultValue: sequelize.literal('uuid_generate_v4()'),
          type: sequelize.UUID
        },
        firstName: {
          type: sequelize.STRING,
          allowNull: false,
        },
        lastName: {
          type: sequelize.STRING,
          allowNull: false
        },
        email: {
          type: sequelize.STRING,
          allowNull: false
        },
        roles: {
          type: sequelize.ARRAY(sequelize.STRING),
          defaultValue: [IRoles.USER],
        },
        password: {
          type: sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: sequelize.DATE
        }
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  }
};
