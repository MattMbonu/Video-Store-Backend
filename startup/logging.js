const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function() {
  process.on("uncaughtException", ex => {
    console.log("check the error logs buddy");
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on("unhandledRejection", ex => {
    console.log("check the error logs buddy");
    winston.error(ex.message, ex);
    process.exit(1);
  });

  winston.add(winston.transports.File, { filename: "logfile.log" });
  winston.add(winston.transports.MongoDB, { db: "mongodb://localhost/vidly" });
};
