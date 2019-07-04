const { User } = require("../models/user");
const _ = require("lodash");
const mongoose = require("mongoose");
const config = require("config");
const Joi = require("joi");
const express = require("express");
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

//Get request
router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

//Post requests

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrpyt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
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
  return Joi.validate(req, schema);
}

//put requests

router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    },
    { new: true }
  );
  if (!user) return res.status(400).send("no such user exists");
  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) res.status(400).send("no such user exists");
  res.send(user);
});

module.exports = router;
