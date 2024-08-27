"use strict";

const shopModel = require("../models/shopModel");
const bcrypt = require("bcrypt");
const keyTokenService = require("./keyTokenService");
const {
  createTokenPair,
  verifyJWT,
  generateKeyPair,
} = require("../utils/authUtils");
const { getInfoData } = require("../utils");
const {
  badRequestError,
  notFoundError,
  unauthorizedError,
  forbbidenError,
} = require("../core/errorResponse");
const shopService = require("./shopService");
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
      throw new badRequestError("shop already registerd");
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
      const { publicKey, privateKey } = generateKeyPair();
      //save key pair to dbs
      const newTokens = keyTokenService.saveKeyPair({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!newTokens) throw new badRequestError("register fail");
      return {
        shop: getInfoData(["_id", "name", "email"], newShop),
      };
    }
    throw new badRequestError("register fail");
  };

  static login = async ({ email, pass, refreshToken = null }) => {
    const shop = await shopService.findByEmail({ email });
    if (!shop) {
      throw new notFoundError("No account found with this email");
    }
    const match = bcrypt.compare(pass, shop.pass);
    if (!match) {
      throw new unauthorizedError("Incorrect password");
    }
    const foundToken = await keyTokenService.findByUserId({ userId: shop._id });

    //create access token, refresh token
    const tokens = await createTokenPair(
      { userId: shop._id, email: shop.email },
      foundToken.publicKey,
      foundToken.privateKey
    );

    //save refresh token
    await keyTokenService.saveRefreshToken({
      userId: shop._id,
      refreshToken: tokens.refreshToken,
    });
    return {
      shop: getInfoData(["_id", "name", "email"], shop),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = keyTokenService.updateNewKeyToken({
      keyToken: keyStore,
      oldRefreshToken: keyStore.refreshToken,
      newRefreshToken: null,
    });
    return delKey;
  };

  static handleRefreshToken = async (refreshToken) => {
    //check refreshToken used
    const foundToken = await keyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      //reset publickey, private key
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      await keyTokenService.removeByUserId(userId);
      const { publicKey, privateKey } = generateKeyPair();
      await keyTokenService.saveKeyPair({ userId, publicKey, privateKey });
      throw new forbbidenError("something wrong happend!! please relogin");
    }

    //verify resfresh token
    const holderToken = await keyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new forbbidenError("please relogin!!");
    }
    const { userId, email } = verifyJWT(refreshToken, holderToken.privateKey);
    const foundShop = shopService.findByEmail({ email });
    if (!foundShop) throw new notFoundError("shop not found!! please register");

    //create new accessToken, refreshToken
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    //update keyToken
    await keyTokenService.updateNewKeyToken({
      keyToken: holderToken,
      oldRefreshToken: refreshToken,
      newRefreshToken: tokens.refreshToken,
    });

    return {
      shop: { userId, email },
      tokens,
    };
  };
}

module.exports = accessService;
