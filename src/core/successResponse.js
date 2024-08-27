"use strict";
const statusCode = require("./statusCode");
const reasonPhrases = require("./reasonPhrases");

class successResponse {
  constructor({
    message,
    status = statusCode.OK,
    reasonStatus = reasonPhrases.OK,
    metadata = {},
  }) {
    this.message = message ? message : reasonStatus;
    this.status = status;
    this.metadata = metadata;
  }

  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends successResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends successResponse {
  constructor({
    message,
    status = statusCode.CREATED,
    reasonStatus = reasonPhrases.CREATED,
    metadata,
  }) {
    super({ message, status, reasonStatus, metadata });
  }
}
module.exports = { OK, CREATED, successResponse };
