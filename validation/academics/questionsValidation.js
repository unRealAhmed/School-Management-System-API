const Joi = require('joi');

const questionValidationSchema = Joi.object({
  question: Joi.string()
    .required()
    .messages({
      'any.required': 'Question is required',
    }),

  optionA: Joi.string()
    .required()
    .messages({
      'any.required': 'Option A is required',
    }),

  optionB: Joi.string()
    .required()
    .messages({
      'any.required': 'Option B is required',
    }),

  optionC: Joi.string()
    .required()
    .messages({
      'any.required': 'Option C is required',
    }),

  optionD: Joi.string()
    .required()
    .messages({
      'any.required': 'Option D is required',
    }),

  correctAnswer: Joi.string()
    .required()
    .messages({
      'any.required': 'Correct answer is required',
    }),

  isCorrect: Joi.boolean().default(false),

  createdBy: Joi.string()
    .required()
    .messages({
      'any.required': 'Created by teacher is required',
    }),

}).options({ stripUnknown: true });

const questionUpdateSchema = Joi.object({
  question: Joi.string()
    .min(3)
    .max(500)
    .messages({
      'string.min': 'Question must be at least {#limit} characters long',
      'string.max': 'Question cannot exceed {#limit} characters',
    }),

  optionA: Joi.string()
    .min(1)
    .max(100)
    .messages({
      'string.min': 'Option A must be at least {#limit} character long',
      'string.max': 'Option A cannot exceed {#limit} characters',
    }),

  optionB: Joi.string()
    .min(1)
    .max(100)
    .messages({
      'string.min': 'Option B must be at least {#limit} character long',
      'string.max': 'Option B cannot exceed {#limit} characters',
    }),

  optionC: Joi.string()
    .min(1)
    .max(100)
    .messages({
      'string.min': 'Option C must be at least {#limit} character long',
      'string.max': 'Option C cannot exceed {#limit} characters',
    }),

  optionD: Joi.string()
    .min(1)
    .max(100)
    .messages({
      'string.min': 'Option D must be at least {#limit} character long',
      'string.max': 'Option D cannot exceed {#limit} characters',
    }),

  correctAnswer: Joi.string()
    .min(1)
    .max(100)
    .messages({
      'string.min': 'Correct answer must be at least {#limit} character long',
      'string.max': 'Correct answer cannot exceed {#limit} characters',
    }),

}).options({ stripUnknown: true });

module.exports = { questionValidationSchema, questionUpdateSchema };
