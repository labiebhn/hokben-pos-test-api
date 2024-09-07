"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaction_detail_raws", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      transactionDetailId: {
        type: Sequelize.INTEGER,
        model: "transaction_details",
        key: "id",
        allowNull: false,
      },
      rawId: {
        type: Sequelize.INTEGER,
        model: "raws",
        key: "id",
        allowNull: false,
      },
      usageInGram: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pricePerKg: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      usageInGramTotal: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transaction_detail_raws");
  },
};
