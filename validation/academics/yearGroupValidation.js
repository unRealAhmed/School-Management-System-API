const Joi = require('joi');

const yearGroupValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Year group name is required',
    }),

  createdBy: Joi.string()
    .required()
    .messages({
      'any.required': 'Created by admin is required',
    }),

  academicYear: Joi.string()
    .required()
    .messages({
      'any.required': 'Academic year is required',
    }),

}).options({ stripUnknown: true });

const yearGroupUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name cannot exceed {#limit} characters',
    }),

  description: Joi.string(),

}).options({ stripUnknown: true });

module.exports = { yearGroupValidationSchema, yearGroupUpdateSchema };
