const Joi = require('joi');

const academicYearValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Academic year name is required',
    }),

  fromYear: Joi.date()
    .required()
    .messages({
      'any.required': 'Start date of the academic year is required',
      'date.base': 'Invalid start date format',
    }),

  toYear: Joi.date()
    .required()
    .messages({
      'any.required': 'End date of the academic year is required',
      'date.base': 'Invalid end date format',
    }),

  isCurrent: Joi.boolean().default(false),

  createdBy: Joi.string()
    .required()
    .messages({
      'any.required': 'Created by admin is required',
    }),

  students: Joi.array().items(Joi.string()),

  teachers: Joi.array().items(Joi.string()),

}).options({ stripUnknown: true });

const academicYearUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name cannot exceed {#limit} characters',
    }),
}).options({ stripUnknown: true });

module.exports = { academicYearValidationSchema, academicYearUpdateSchema };
