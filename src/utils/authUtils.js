"use strict";
const JWT = require("jsonwebtoken");
const createTokenPair = async (payload, privateKey) => {
  try {
    //access token
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
    });

    //refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "30d",
    });

    //verify
    // JWT.verify(accessToken, publicKey, (err, decode) => {
    //   if (err) {
    //     console.log("error verify", err);
    //   } else {
    //     console.log("decode verify", decode);
    //   }
    // });

    return { accessToken, refreshToken };
  } catch (err) {
    console.error("Error creating token pair: ", err);
    throw new Error("Failed to create token pair");
  }
};

module.exports = { createTokenPair };
