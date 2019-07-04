const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");

//Get requests
router.get("/", auth, async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.get("/:id", auth, async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

//Post requests
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  });

  let customerDone = await customer.save();
  res.send(customerDone);
});

//Put request

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone
    },
    { new: true }
  );
  if (!customer) return res.status(404).send("Customer does not exist");
  res.send(customer);
});

//delete request

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).send("Customer does not exist");
  res.send(customer);
});

module.exports = router;
