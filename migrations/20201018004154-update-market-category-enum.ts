import Sequelize, { QueryInterface } from "sequelize";
import { IMarketCategories } from "src/market/interfaces/market";
import { enumToArray } from "src/utils";

const escapeCategoryValues = (categories: string[]) => categories.map(item => `'${item}'`).join(', ');

module.exports = {
  up: async (queryInterface: QueryInterface, sequelize: typeof Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query('ALTER TYPE "enum_Markets_category" RENAME TO "enum_Markets_category_old"', { transaction })
      await queryInterface.sequelize.query(`CREATE TYPE "enum_Markets_category" AS ENUM(${escapeCategoryValues(enumToArray(IMarketCategories))})`, { transaction })
      await queryInterface.sequelize.query('ALTER TABLE "Markets" ALTER COLUMN category TYPE "enum_Markets_category" USING category::text::"enum_Markets_category"', { transaction })
      await queryInterface.sequelize.query('DROP TYPE "enum_Markets_category_old"', { transaction })
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  down: async (queryInterface: QueryInterface, sequelize: typeof Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query('ALTER TYPE "enum_Markets_category" RENAME TO "enum_Markets_category_old"', { transaction })
      await queryInterface.sequelize.query(`CREATE TYPE "enum_Markets_category" AS ENUM(${escapeCategoryValues(['Furniture', 'Groceries', 'Restaurants', 'Electronics'])})`, { transaction })
      await queryInterface.sequelize.query('ALTER TABLE "Markets" ALTER COLUMN category TYPE "enum_Markets_category" USING category::text::"enum_Markets_category"', { transaction })
      await queryInterface.sequelize.query('DROP TYPE "enum_Markets_category_old"', { transaction })
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
