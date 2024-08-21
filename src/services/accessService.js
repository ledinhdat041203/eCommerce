"use strict";

const shopModel = require("../models/shopModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyTokenService");
const { createTokenPair } = require("../utils/authUtils");
const { getInfoData } = require("../utils");
const { badResquestError } = require("../core/errorResponse");
const roles = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITER: "EDITER",
  ADMIN: "ADMIN",
};
class accessService {
  static signUp = async ({ name, email, pass }) => {
    //check exist
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new badResquestError("shop already registerd");
    }
    // hash password, create shop
    const passHash = await bcrypt.hash(pass, 10);
    const newShop = await shopModel.create({
      name,
      email,
      pass: passHash,
      roles: [roles.SHOP],
    });

    if (newShop) {
      //create public key, private key
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      //save public key to db
      const keyToken = await keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey: publicKey,
      });
      if (!keyToken) {
        throw new badResquestError("create key error");
      }

      //create access token, refresh token
      // const publicKeyObject = crypto.createPublicKey({
      //   key: publicKeyString,
      //   format: "pem",
      //   type: "pkcs1",
      // });
      const tokens = await createTokenPair(
        { userId: newShop._id, email: newShop.email },
        privateKey
      );
      // save tokes
      const result = keyTokenService.addRefreshToken({
        userId: newShop._id,
        refreshToken: tokens.refreshToken,
      });
      if (result.modifiedCount === 0) {
        throw new badResquestError("Failed to update key token");
      }

      return {
        status: 201,
        metadata: {
          shop: getInfoData(["_id", "name", "email"], newShop),
          tokens,
        },
      };
    }
    return { status: 200, metadata: null };
  };
}

module.exports = accessService;
