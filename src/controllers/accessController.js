"use strict";

const accessService = require("../services/accessService");

class accessController {
  signUp = async (req, res, next) => {
    try {
      console.log("signUp::", req.body);
      return res.status(201).json(await accessService.signUp(req.body));
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new accessController();
