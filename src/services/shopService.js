"use strict";

const shopModel = require("../models/shopModel");

class shopService {
  static findByEmail = async ({
    email,
    select = { name: 1, email: 1, pass: 1, roles: 1, status: 1 },
  }) => {
    return await shopModel.findOne({ email }).select(select).lean();
  };
}

module.exports = shopService;
