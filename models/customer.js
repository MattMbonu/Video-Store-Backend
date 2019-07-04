const mongoose = require("mongoose");
const Joi = require("joi");

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(9)
      .max(50)
      .required(),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, required: true },
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  phone: { type: String, required: true, minlength: 9, maxlength: 50 }
});

const Customer = mongoose.model("Customer", customerSchema);

exports.Customer = Customer;
exports.validate = validateCustomer;
