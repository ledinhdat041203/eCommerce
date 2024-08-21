"use strict";
const _ = require("lodash");
const getInfoData = (filed = [], object = {}) => {
  return _.pick(object, filed);
};
module.exports = { getInfoData };
