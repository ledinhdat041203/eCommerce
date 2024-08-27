"use strict";
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //access token
    const accessToken = await JWT.sign(payload, publicKey, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    //refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "HS256",
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  } catch (err) {
    console.error("Error creating token pair: ", err);
    throw new Error("Failed to create token pair");
  }
};

const verifyJWT = async (token, secretKey) => {
  return await JWT.verify(token, secretKey);
};

const generateKeyPair = () => {
  const publicKey = crypto.randomBytes(64).toString("hex");
  const privateKey = crypto.randomBytes(64).toString("hex");
  return { publicKey, privateKey };
};
module.exports = { createTokenPair, verifyJWT, generateKeyPair };
