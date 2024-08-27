"use strict";

const keyTokenModel = require("../models/keyTokenModel");

class keyTokenService {
  static saveKeyPair = async ({ userId, publicKey, privateKey }) => {
    try {
      const tokens = keyTokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });
      return tokens ? tokens : null;
    } catch (err) {
      throw err;
    }
  };
  static saveRefreshToken = async ({ userId, refreshToken }) => {
    try {
      const filter = { user: userId },
        update = { refreshToken },
        options = { upsert: true, new: true };
      const tokens = keyTokenModel.findOneAndUpdate(filter, update, options);
      return tokens ? tokens : null;
    } catch (err) {
      throw err;
    }
  };

  static addRefreshToken = async ({ userId, refreshToken }) => {
    const result = await keyTokenModel.updateOne(
      { user: userId },
      { refreshToken: refreshToken }
    );
    return result;
  };

  static findByUserId = async ({ userId }) => {
    return await keyTokenModel.findOne({ user: userId });
  };

  static removeById = async (id) => {
    return await keyTokenModel.deleteOne(id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  };

  static removeByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };

  static findByRefreshToken = async (refreshToken) => {
    return keyTokenModel.findOne({ refreshToken });
  };

  static updateNewKeyToken = async ({
    keyToken,
    oldRefreshToken,
    newRefreshToken,
  }) => {
    keyToken.refreshToken = newRefreshToken;
    keyToken.refreshTokensUsed.push(oldRefreshToken);
    return await keyToken.save();
  };
}

module.exports = keyTokenService;
