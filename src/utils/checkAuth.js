"use strict";

const apiKeyService = require("../services/apiKeyService");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const checkApiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY];
    if (!key) {
      return res.status(403).json({
        message: "forbidden error",
      });
    }
    const objKey = await apiKeyService.findByKey(key);
    if (!objKey) {
      return res.status(403).json({
        message: "forbidden error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (err) {}
};

const checkPermissions = (permissions) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "permission denied",
      });
    }
    const validPermissions = req.objKey.permissions.includes(permissions);
    if (!validPermissions) {
      return res.status(403).json({
        message: "permission denied",
      });
    }

    return next();
  };
};
module.exports = { checkApiKey, checkPermissions };
