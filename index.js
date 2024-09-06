require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const modules = require("./modules");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(
  "/public/products",
  express.static(path.join(__dirname, "public/products"))
);

app.use(modules);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
