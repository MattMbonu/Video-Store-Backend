const winston = require("winston");

module.exports = function(err, req, res, next) {
  if (err) {
    winston.error(err.message, err);

    return res.status(500).send("something went wrong");
  }
  next();
};
