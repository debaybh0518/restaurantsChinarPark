const Joi = require('joi');

exports.onboardingSchema = Joi.object({
  company: Joi.string().min(2).max(255).required(),
  companyPhone: Joi.string().min(6).max(20).required(),
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(255).required(),
  phone: Joi.string().min(6).max(20).required(),
  address: Joi.string().min(2).max(255).required(),
  branches: Joi.number().integer().min(1).max(20).required(),
});

exports.branchesBulkSchema = Joi.object({
  branches: Joi.array().items(
    Joi.object({
      name: Joi.string().min(2).max(255).required(),
      address: Joi.string().min(2).max(255).required(),
    })
  ).min(1).max(20).required(),
});