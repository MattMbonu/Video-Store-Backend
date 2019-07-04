const winston = require("winston");
const express = require("express");
const app = express();
require("./startup/config")();
require("./startup/logging")();
require("./startup/db")();
require("./startup/validation")();
require("./startup/routes")(app);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  winston.info("listening on port 1337");
});
