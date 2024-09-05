const db = require("../../models");
const { setResponse, removeImage } = require("../../utils/helpers");

const Products = db.products;

exports.createProduct = async (req, res, next) => {
  try {
    const { body, file } = req;
    let status = 200;
    let message = "Success";
    let data = {};

    const schema = {
      name: body?.name,
      price: body?.price,
      imageUri: file?.path,
    };
    await Products.create(schema);

    res.status(status).json(setResponse(status, message, data));
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    let status = 200;
    let message = "Success";
    let data = [];

    data = await Products.findAll({
      attributes: { exclude: ["deletedAt", "updatedAt"] },
      order: [["name", "ASC"]],
      where: { deletedAt: null },
    });

    res.status(status).json(setResponse(status, message, data));
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { body, file, params } = req;
    let status = 200;
    let message = "Success";
    let data = {};

    let schema = {
      name: body?.name,
      price: body?.price,
    };
    if (file?.path) {
      schema.imageUri = file.path;
      const product = await Products.findByPk(params?.id, {
        attributes: ["imageUri"],
        raw: true,
      });
      removeImage(product?.imageUri);
    }

    await Products.update(schema, { where: { id: params?.id } });

    res.status(status).json(setResponse(status, message, data));
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { params } = req;
    let status = 200;
    let message = "Success";
    let data = {};

    const product = await Products.findByPk(params?.id, {
      attributes: ["imageUri"],
      raw: true,
    });
    removeImage(product?.imageUri);

    await Products.update(
      { deletedAt: new Date() },
      { where: { id: params?.id } }
    );

    res.status(status).json(setResponse(status, message, data));
  } catch (error) {
    next(error);
  }
};
