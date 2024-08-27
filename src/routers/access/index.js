"use strict";
const express = require("express");
const accessController = require("../../controllers/accessController");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { authentication } = require("../../utils/checkAuth");

router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));

//check authen
router.use(authentication);
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/handleRefreshToken",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
