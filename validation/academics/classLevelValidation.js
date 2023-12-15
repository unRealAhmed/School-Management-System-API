const Joi = require('joi');

const classLevelValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Class level name is required',
    }),

  description: Joi.string(),

  createdBy: Joi.string()
    .required()
    .messages({
      'any.required': 'Created by admin is required',
    }),

  students: Joi.array().items(Joi.string()),

  subjects: Joi.array().items(Joi.string()),

  teachers: Joi.array().items(Joi.string()),

}).options({ stripUnknown: true });

const classLevelUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name cannot exceed {#limit} characters',
    }),

  description: Joi.string(),

}).options({ stripUnknown: true });

module.exports = { classLevelValidationSchema, classLevelUpdateSchema };
