"use strict";
const statusCode = require("./statusCode");
const reasonPhrases = require("./reasonPhrases");

class errorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class conflictResquestError extends errorResponse {
  constructor(message = reasonPhrases.CONFLICT, status = statusCode.CONFLICT) {
    super(message, status);
  }
}

class badResquestError extends errorResponse {
  constructor(
    message = reasonPhrases.BAD_REQUEST,
    status = statusCode.BAD_REQUEST
  ) {
    super(message, status);
  }
}

module.exports = { conflictResquestError, badResquestError };
