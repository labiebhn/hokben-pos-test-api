const { METHOD_ORDER, PACKAGING_COST } = require("../../config/order");
const db = require("../../models");
const { setResponse, generateInvoice } = require("../../utils/helpers");

const Transactions = db.transactions;
const TransactionDetails = db.transaction_details;
const TransactionsDetailRaws = db.transaction_detail_raws;
const Products = db.products;
const ProductRaws = db.product_raws;
const Raws = db.raws;

exports.createTransaction = async (req, res, next) => {
  try {
    const { body } = req;
    let status = 200;
    let message = "Success";
    let data = {};

    const { method, orders } = body;
    const isTakeAway = method === METHOD_ORDER.TAKE_AWAY;
    let productIds = [];
    for (let order of orders) {
      productIds.push(order?.productId);
    }

    // Get desired products
    const products = await Products.findAll({
      attributes: ["id", "price"],
      where: { deletedAt: null, id: productIds },
      include: [
        {
          model: ProductRaws,
          as: "raws",
          required: false,
          attributes: ["id", "usageInGram"],
          where: { deletedAt: null },
          include: [
            {
              model: Raws,
              as: "detail",
              attributes: ["id", "pricePerKg"],
            },
          ],
        },
      ],
    });

    // Insert transactions
    let productTotal = 0;
    let productQty = 0;
    let packagingTotal = 0;
    let grandTotal = 0;
    for (let order of orders) {
      const product = products.find(
        (product) => product?.id === order?.productId
      );
      productTotal += Number(product?.price) * Number(order?.qty);
      productQty += Number(order?.qty);
      packagingTotal += isTakeAway ? PACKAGING_COST * Number(order?.qty) : 0;
      grandTotal += productTotal + packagingTotal;
    }
    let transactionSchema = {
      invoice: generateInvoice(),
      productTotal,
      productQty,
      packagingTotal,
      grandTotal,
      orderMethod: method,
    };
    const transaction = await Transactions.create(transactionSchema);

    // Insert transaction_details
    let transactionDetailSchemas = [];
    for (let order of orders) {
      const product = products.find(
        (product) => product?.id === order?.productId
      );
      let total = Number(product?.price) * Number(order?.qty);
      let payload = {
        transactionId: transaction?.id,
        productId: order?.productId,
        productPrice: product?.price,
        qty: order?.qty,
        total,
      };
      transactionDetailSchemas.push(payload);
    }
    const transactionDetails = await TransactionDetails.bulkCreate(
      transactionDetailSchemas
    );

    // Insert transaction_details
    let transactionDetailRawSchemas = [];
    let i = 0;
    for (let order of orders) {
      const product = products.find(
        (product) => product?.id === order?.productId
      );
      const transactionDetail = transactionDetails[i];
      for (let raw of product?.raws) {
        let usageInGramTotal = Number(raw?.usageInGram) * Number(order?.qty);
        let payload = {
          transactionDetailId: transactionDetail?.id,
          rawId: raw?.detail?.id,
          usageInGram: raw?.usageInGram,
          pricePerKg: raw?.detail?.pricePerKg,
          usageInGramTotal,
        };
        transactionDetailRawSchemas.push(payload);
      }
      i++;
    }
    await TransactionsDetailRaws.bulkCreate(transactionDetailRawSchemas);

    res.status(status).json(setResponse(status, message, data));
  } catch (error) {
    next(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    let status = 200;
    let message = "Success";
    let data = [];

    data = await Transactions.findAll({
      attributes: { exclude: ["deletedAt", "updatedAt"] },
      order: [["createdAt", "DESC"]],
      where: { deletedAt: null },
      include: [
        {
          model: TransactionDetails,
          as: "transactionDetails",
          attributes: { exclude: ["deletedAt", "updatedAt"] },
          include: [
            {
              model: TransactionsDetailRaws,
              as: "transactionRaws",
              attributes: { exclude: ["deletedAt", "updatedAt"] },
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

exports.getTransactionDetail = async (req, res, next) => {
  try {
    const { params } = req;
    let status = 200;
    let message = "Success";
    let data = {};

    data = await Transactions.findOne({
      attributes: { exclude: ["deletedAt", "updatedAt"] },
      order: [["createdAt", "ASC"]],
      where: { id: params?.id, deletedAt: null },
      include: [
        {
          model: TransactionDetails,
          as: "transactionDetails",
          attributes: { exclude: ["deletedAt", "updatedAt"] },
          include: [
            {
              model: Products,
              attributes: ["id", "name"],
            },
            {
              model: TransactionsDetailRaws,
              as: "transactionRaws",
              attributes: { exclude: ["deletedAt", "updatedAt"] },
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

exports.getTransactionSummary = async (req, res, next) => {
  try {
    let status = 200;
    let message = "Success";
    let data = [];

    const transactions = await Transactions.findAll({
      attributes: { exclude: ["deletedAt", "updatedAt"] },
      order: [["createdAt", "ASC"]],
      where: { deletedAt: null },
      include: [
        {
          model: TransactionDetails,
          as: "transactionDetails",
          attributes: { exclude: ["deletedAt", "updatedAt"] },
          include: [
            {
              model: TransactionsDetailRaws,
              as: "transactionRaws",
              attributes: { exclude: ["deletedAt", "updatedAt"] },
            },
          ],
        },
      ],
    });

    let omzet = 0;
    let profit = 0;
    let totalTransaction = 0;
    let totalProductSold = 0;
    let totalPackagingSold = 0;
    let totalPackagingAmount = 0;
    let totalDineInSold = 0;
    let totalTakeAwaySold = 0;
    for (let transaction of transactions) {
      omzet += Number(transaction?.grandTotal);
      totalTransaction += 1;
      totalProductSold += Number(transaction?.productQty);
      totalPackagingSold += Number(transaction?.productQty);
      totalPackagingAmount += Number(transaction?.packagingTotal);
      if (transaction?.orderMethod === METHOD_ORDER.DINE_IN) {
        totalDineInSold += 1;
      } else {
        totalTakeAwaySold += 1;
      }
      for (let transactionDetail of transaction?.transactionDetails) {
        let rawCost = 0;
        for (let transactionRaw of transactionDetail?.transactionRaws) {
          const { usageInGramTotal, pricePerKg } = transactionRaw;
          const pricePerGram = Number(pricePerKg) / 1000;
          rawCost += Math.ceil(pricePerGram * Number(usageInGramTotal));
        }
        profit += Number(transactionDetail?.total) - Number(rawCost);
      }
    }

    data = {
      omzet,
      profit,
      totalTransaction,
      totalProductSold,
      totalPackagingSold,
      totalPackagingAmount,
      totalDineInSold,
      totalTakeAwaySold,
    };

    res.status(status).json(setResponse(status, message, data));
  } catch (error) {
    next(error);
  }
};
