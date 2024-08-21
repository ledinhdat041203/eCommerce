"use strict";

const apiKeyModel = require("../models/apiKeyModel");

class apiKeyService {
  static findByKey = async (key) => {
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
    return objKey;
  };
}

module.exports = apiKeyService;
