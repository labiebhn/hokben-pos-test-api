"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      invoice: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      productTotal: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      productQty: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      packagingTotal: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      grandTotal: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transactions");
  },
};
