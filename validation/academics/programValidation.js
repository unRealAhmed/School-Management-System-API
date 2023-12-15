const Joi = require('joi');

const programValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Program name is required',
    }),

  description: Joi.string()
    .required()
    .messages({
      'any.required': 'Program description is required',
    }),

  duration: Joi.string().default('4 years'),

  code: Joi.string(),

  createdBy: Joi.string()
    .required()
    .messages({
      'any.required': 'Created by admin is required',
    }),

  teachers: Joi.array().items(Joi.string()),

  students: Joi.array().items(Joi.string()),

  subjects: Joi.array().items(Joi.string()),

}).options({ stripUnknown: true });

const programUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name cannot exceed {#limit} characters',
    }),

  description: Joi.string(),

}).options({ stripUnknown: true });

module.exports = { programValidationSchema, programUpdateSchema };
