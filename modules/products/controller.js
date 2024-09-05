const db = require("../../models");
const { setResponse, removeImage } = require("../../utils/helpers");

const Products = db.products;
const ProductRaws = db.product_raws;
const Raws = db.raws;

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
    const productResult = await Products.create(schema);

    let schemaProductRaws = [];
    for (let raw of body?.raws) {
      schemaProductRaws.push({
        productId: productResult?.id,
        rawId: raw?.rawId,
        usageInGram: raw?.usageInGram,
      });
    }
    await ProductRaws.bulkCreate(schemaProductRaws);

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
      include: [
        {
          model: ProductRaws,
          as: "raws",
          required: false,
          attributes: { exclude: ["createdAt", "deletedAt", "updatedAt"] },
          where: { deletedAt: null },
          include: [
            {
              model: Raws,
              as: "detail",
              attributes: { exclude: ["createdAt", "deletedAt", "updatedAt"] },
            },
          ],
        },
      ],
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

    if (body?.raws) {
      let schemaProductRaws = [];
      for (let raw of body?.raws) {
        schemaProductRaws.push({
          id: raw?.id || null,
          productId: params?.id,
          rawId: raw?.rawId,
          usageInGram: raw?.usageInGram,
        });
      }
      await ProductRaws.bulkCreate(schemaProductRaws, {
        updateOnDuplicate: ["usageInGram"],
      });
    }

    if (body?.deletedRaws || body?.deletedRaws?.length) {
      await ProductRaws.update(
        { deletedAt: new Date() },
        { where: { id: body.deletedRaws } }
      );
    }

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
