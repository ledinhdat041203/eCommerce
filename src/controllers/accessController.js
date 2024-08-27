"use strict";

const accessService = require("../services/accessService");
const { CREATED, successResponse } = require("../core/successResponse");

class accessController {
  signUp = async (req, res, next) => {
    const result = new CREATED({
      message: "register success",
      metadata: await accessService.signUp(req.body),
    });
    return result.send(res);
  };

  login = async (req, res, next) => {
    return new successResponse({
      message: "login successful",
      metadata: await accessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    return new successResponse({
      message: "logout successful",
      metadata: await accessService.logout(req.keyStore),
    }).send(res);
  };

  handleRefreshToken = async (req, res, next) => {
    return new successResponse({
      message: "get token success",
      metadata: await accessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };
}

module.exports = new accessController();
