"use strict";

const asyncHandler = require("express-async-handler");
const apiKeyService = require("../services/apiKeyService");
const JWT = require("jsonwebtoken");
const {
  notFoundError,
  badRequestError,
  unauthorizedError,
  forbbidenError,
} = require("../core/errorResponse");
const keyTokenService = require("../services/keyTokenService");

const HEADER = {
  API_KEY: "x-api-key",
  CLENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};
const checkApiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY];
    if (!key) {
      throw new forbbidenError("forbidden error");
    }
    const objKey = await apiKeyService.findByKey(key);
    if (!objKey) {
      throw new forbbidenError("forbidden error");
    }
    req.objKey = objKey;
    return next();
  } catch (err) {}
};

const checkPermissions = (permissions) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      throw new forbbidenError("permission denied");
    }
    const validPermissions = req.objKey.permissions.includes(permissions);
    if (!validPermissions) {
      throw new forbbidenError("permission denied");
    }

    return next();
  };
};
const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLENT_ID];
  if (!userId) throw new unauthorizedError("invalid request");

  const keyStore = await keyTokenService.findByUserId({ userId });
  if (!keyStore) throw new notFoundError("not found store");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new unauthorizedError("invalid request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    console.log(decodeUser);
    if (decodeUser.userId !== userId)
      throw new unauthorizedError("invalid request");
    req.keyStore = keyStore;
    next();
  } catch (err) {
    throw err;
  }
});
module.exports = { checkApiKey, checkPermissions, authentication };
