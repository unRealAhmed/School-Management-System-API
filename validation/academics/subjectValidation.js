const Joi = require('joi');

const subjectValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Subject name is required',
    }),

  description: Joi.string()
    .required()
    .messages({
      'any.required': 'Subject description is required',
    }),

  teacher: Joi.string(),

  academicTerm: Joi.string()
    .required()
    .messages({
      'any.required': 'Academic term is required',
    }),

  createdBy: Joi.string()
    .required()
    .messages({
      'any.required': 'Created by admin is required',
    }),

  duration: Joi.string().default('3 months'),

}).options({ stripUnknown: true });

const subjectUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name cannot exceed {#limit} characters',
    }),

  description: Joi.string(),

}).options({ stripUnknown: true });

module.exports = { subjectValidationSchema, subjectUpdateSchema };
