"use strict";
const express = require("express");
const accessController = require("../../controllers/accessController");
const router = express.Router();

router.post("/shop/signup", accessController.signUp);

module.exports = router;
