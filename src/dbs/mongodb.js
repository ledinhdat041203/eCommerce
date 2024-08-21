"use strict";
const mongoose = require("mongoose");
class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    if (type === "mongodb") {
      const {
        db: { host, port, name },
      } = require("../configs/configMongodb");
      const connectString = `mongodb://${host}:${port}/${name}`;

      mongoose
        .connect(connectString)
        .then(() => console.log("connected mongodb sucess, dbName: ", name))
        .catch((err) => console.log(`error connect: ${err}`));
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
