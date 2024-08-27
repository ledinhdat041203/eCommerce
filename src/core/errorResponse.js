"use strict";
const statusCode = require("./statusCode");
const reasonPhrases = require("./reasonPhrases");

class errorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class conflictRequestError extends errorResponse {
  constructor(message = reasonPhrases.CONFLICT, status = statusCode.CONFLICT) {
    super(message, status);
  }
}

class badRequestError extends errorResponse {
  constructor(
    message = reasonPhrases.BAD_REQUEST,
    status = statusCode.BAD_REQUEST
  ) {
    super(message, status);
  }
}

class notFoundError extends errorResponse {
  constructor(
    message = reasonPhrases.NOT_FOUND,
    status = statusCode.NOT_FOUND
  ) {
    super(message, status);
  }
}

class unauthorizedError extends errorResponse {
  constructor(
    message = reasonPhrases.UNAUTHORIZED,
    status = statusCode.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

class forbbidenError extends errorResponse {
  constructor(
    message = reasonPhrases.FORBIDDEN,
    status = statusCode.FORBIDDEN
  ) {
    super(message, status);
  }
}

module.exports = {
  conflictRequestError,
  badRequestError,
  notFoundError,
  unauthorizedError,
  forbbidenError,
};
