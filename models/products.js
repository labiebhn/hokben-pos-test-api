module.exports = (sequelize, Sequelize) => {
  const result = sequelize.define("products", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    price: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    imageUri: {
      type: Sequelize.STRING,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  });
  return result;
};
