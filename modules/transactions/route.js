const express = require("express");
const {
  createTransaction,
  getTransaction,
  getTransactionDetail,
  getTransactionSummary,
} = require("./controller");

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getTransaction);
router.get("/summary", getTransactionSummary);
router.get("/:id", getTransactionDetail);

module.exports = router;
