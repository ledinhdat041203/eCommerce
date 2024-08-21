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

module.exports = app;
