"use strict";

const app = require("./src/app");
require("dotenv").config();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
process.on("SIGINT", () => {
  server.close(() => console.log("Exit server"));
});
