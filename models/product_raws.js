module.exports = (sequelize, Sequelize) => {
  const result = sequelize.define("product_raws", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    productId: {
      type: Sequelize.INTEGER,
      model: "Products",
      key: "id",
      allowNull: false,
    },
    rawId: {
      type: Sequelize.INTEGER,
      model: "Raws",
      key: "id",
      allowNull: false,
    },
    usageInGram: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  });
  return result;
};
