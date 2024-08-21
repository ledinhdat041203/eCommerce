"use strict";

const keyTokenModel = require("../models/keyTokenModel");

class keyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const token = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });
      return token ? token : null;
    } catch (error) {
      return {
        message: error.message,
        status: "error",
      };
    }
  };

  static addRefreshToken = async ({ userId, refreshToken }) => {
    const result = await keyTokenModel.updateOne(
      { user: userId },
      { $push: { refreshToken: refreshToken } }
    );
    return result;
  };
}

module.exports = keyTokenService;
