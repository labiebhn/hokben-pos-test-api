module.exports = (sequelize, Sequelize) => {
  const result = sequelize.define("transactions", {
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
    orderMethod: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  });
  return result;
};
