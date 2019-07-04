const { User, validate } = require("../models/user");
const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const bcrpyt = require("bcrypt");
const auth = require("../middleware/auth");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");

//Get request
router.get("/", auth, async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//Post requests

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const already = await User.findOne({ email: req.body.email });
  if (already) {
    return res.status(400).send("This Email is already registered to a user");
  }

  const user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrpyt.genSalt(10);
  user.password = await bcrpyt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  const userDone = _.pick(user, ["_id", "name", "email"]);

  res.header("x-auth-token", token).send(userDone);
});

//put requests

router.put("/:id", auth, async (req, res) => {
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

router.delete("/:id", auth, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) res.status(400).send("no such user exists");
  res.send(user);
});

module.exports = router;
