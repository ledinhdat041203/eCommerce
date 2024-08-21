"use strict";

const accessService = require("../services/accessService");

class accessController {
  signUp = async (req, res, next) => {
    const result = await accessService.signUp(req.body);
    return res.status(201).json(result);
  };
}

module.exports = new accessController();
