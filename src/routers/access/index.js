"use strict";
const express = require("express");
const accessController = require("../../controllers/accessController");
const router = express.Router();
const asyncHandler = require("express-async-handler");

router.post("/shop/signup", asyncHandler(accessController.signUp));

module.exports = router;
