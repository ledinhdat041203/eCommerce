"use strict";
const express = require("express");
const { checkApiKey, checkPermissions } = require("../utils/checkAuth");
const router = express.Router();

//check api key
router.use(checkApiKey);
//check permissions
router.use(checkPermissions("0000"));

router.use("/v1/api", require("./access"));

module.exports = router;
