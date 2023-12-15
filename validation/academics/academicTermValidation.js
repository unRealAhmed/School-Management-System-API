const Joi = require('joi');

const academicTermValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Academic term name is required',
    }),

  description: Joi.string()
    .required()
    .messages({
      'any.required': 'Academic term description is required',
    }),

  duration: Joi.string().default('3 months'),

  createdBy: Joi.string()
    .required()
    .messages({
      'any.required': 'Created by admin is required',
    }),
}).options({ stripUnknown: true });


const academicTermUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name cannot exceed {#limit} characters',
    }),

  description: Joi.string(),

}).options({ stripUnknown: true });

module.exports = { academicTermValidationSchema, academicTermUpdateSchema };
