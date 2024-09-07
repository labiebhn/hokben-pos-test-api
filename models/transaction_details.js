module.exports = (sequelize, Sequelize) => {
  const result = sequelize.define("transaction_details", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    transactionId: {
      type: Sequelize.INTEGER,
      model: "transactions",
      key: "id",
      allowNull: false,
    },
    productId: {
      type: Sequelize.INTEGER,
      model: "products",
      key: "id",
      allowNull: false,
    },
    productPrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qty: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    total: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  });
  return result;
};
