const express = require("express");
const raws = require("./raws/route");
const { setResponse } = require("../utils/helpers");

const app = express();

let API_VERSION = "v1";
app.use(`/${API_VERSION}/raw`, raws);

app.use("/", (req, res, next) => {
  const status = 404;
  const message = "Not Found";
  const data = {};
  res.status(status).json(setResponse(status, message, data));
});

// error handling
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  const data = error.data || null;
  res.status(status).json(setResponse(status, message, data));
});

module.exports = app;
