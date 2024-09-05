const db = require("../../models");
const { setResponse } = require("../../utils/helpers");

const Raws = db.raws;

exports.createRaw = async (req, res, next) => {
  try {
    const { body } = req;
    let status = 200;
    let message = "Success";
    let data = {};

    const schema = {
      name: body?.name,
      pricePerKg: body.pricePerKg,
    };
    await Raws.create(schema);

    res.status(status).json(setResponse(status, message, data));
  } catch (error) {
    next(error);
  }
};

exports.getRaw = async (req, res, next) => {
  try {
    let status = 200;
    let message = "Success";
    let data = [];

    data = await Raws.findAll({
      attributes: { exclude: ["deletedAt", "updatedAt"] },
      order: [["name", "ASC"]],
      where: { deletedAt: null },
    });

    res.status(status).json(setResponse(status, message, data));
  } catch (error) {
    next(error);
  }
};

exports.updateRaw = async (req, res, next) => {
  try {
    const { body, params } = req;
    let status = 200;
    let message = "Success";
    let data = {};

    const schema = {
      name: body?.name,
      pricePerKg: body.pricePerKg,
    };
    await Raws.update(schema, { where: { id: params?.id } });

    res.status(status).json(setResponse(status, message, data));
  } catch (error) {
    next(error);
  }
};

exports.deleteRaw = async (req, res, next) => {
  try {
    const { params } = req;
    let status = 200;
    let message = "Success";
    let data = {};

    await Raws.update({ deletedAt: new Date() }, { where: { id: params?.id } });

    res.status(status).json(setResponse(status, message, data));
  } catch (error) {
    next(error);
  }
};
