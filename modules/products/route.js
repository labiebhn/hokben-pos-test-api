const express = require("express");
const { multer } = require("../../utils/helpers");
const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("./controller");

const router = express.Router();

const upload = multer("products");

router.post("/", upload.single("productImage"), createProduct);
router.get("/", getProduct);
router.put("/:id", upload.single("productImage"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
