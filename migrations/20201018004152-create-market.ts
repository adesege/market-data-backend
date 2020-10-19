import Sequelize, { QueryInterface } from "sequelize";
import { IMarketCategories } from "src/market/interfaces/market";
import { enumToArray } from "src/utils";

module.exports = {
  up: async (queryInterface: QueryInterface, sequelize: typeof Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
      await queryInterface.createTable('Markets', {
        id: {
          allowNull: false,
          primaryKey: true,
          defaultValue: sequelize.literal('uuid_generate_v4()'),
          type: sequelize.UUID
        },
        name: {
          type: sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: sequelize.STRING,
          allowNull: false
        },
        address: {
          type: sequelize.STRING,
          allowNull: false
        },
        category: {
          type: sequelize.ENUM(...enumToArray(IMarketCategories)),
          allowNull: false
        },
        images: {
          type: sequelize.ARRAY(sequelize.STRING),
          allowNull: false,
        },
        longitude: {
          type: sequelize.DOUBLE,
          allowNull: false
        },
        latitude: {
          type: sequelize.DOUBLE,
          allowNull: false
        },
        ownerId: {
          type: sequelize.UUID,
          allowNull: false,
          onDelete: 'CASCADE',
          references: { model: 'Users', key: 'id' }
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
      queryInterface.addIndex('Markets', ['name']);
      queryInterface.addIndex('Markets', ['ownerId']);
      queryInterface.addIndex('Markets', ['longitude']);
      queryInterface.addIndex('Markets', ['latitude']);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('Markets');
    await queryInterface.sequelize.query('DROP TYPE "enum_Markets_category"')
  }
};
