const express = require("express");
const { createRaw, getRaw, updateRaw, deleteRaw } = require("./controller");

const router = express.Router();

router.post("/", createRaw);
router.get("/", getRaw);
router.put("/:id", updateRaw);
router.delete("/:id", deleteRaw);

module.exports = router;
