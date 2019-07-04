const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function() {
  mongoose
    .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
    .then(result => winston.info("connected to mongodb"));
};
