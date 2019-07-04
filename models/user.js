const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
    maxlength: 200
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("user", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
      .max(50),
    email: Joi.string()
      .required()
      .min(8)
      .max(200)
      .email(),
    password: Joi.string()
      .required()
      .min(6)
      .max(1000)
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
