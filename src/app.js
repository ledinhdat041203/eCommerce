const express = require("express");
const app = express();

const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./dbs/mongodb");
//router
app.use("", require("./routers"));

//handle error
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  return next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  return res
    .status(status)
    .json({ status, message: err.message || "Internal server error" });
});

module.exports = app;
