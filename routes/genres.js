const { Genre, validate } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

// Get requests

router.get("/", async (req, res) => {
  console.log("getiing request");
  const genre = await Genre.find()
    .select({ name: 1 })
    .catch(err => console.log(err.message));
  res.send(genre);
});

router.get("/:name", async (req, res) => {
  const genre = await Genre.find({ name: req.params.name });
  if (!genre) return res.status(404).send("the genre was not found");
  res.send(genre);
});

//POST requests

router.post("/", auth, async (req, res) => {
  let genre = new Genre({
    name: req.body.name
  });

  genre = await genre.save();

  res.send(genre);
});

//PUT request

router.put("/:id", auth, async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) return res.status(404).send("the genre was not found");
  res.send(genre);
});

//Delete req

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send("the genre was not found");

  res.send(genre);
});

module.exports = router;
