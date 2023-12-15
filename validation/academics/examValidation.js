const Joi = require('joi');

const examValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Exam name is required',
    }),

  description: Joi.string()
    .required()
    .messages({
      'any.required': 'Exam description is required',
    }),

  subject: Joi.string()
    .required()
    .messages({
      'any.required': 'Subject is required',
    }),

  program: Joi.string()
    .required()
    .messages({
      'any.required': 'Program is required',
    }),

  passMark: Joi.number()
    .required()
    .messages({
      'any.required': 'Pass mark is required',
    }),

  totalMark: Joi.number()
    .required()
    .messages({
      'any.required': 'Total mark is required',
    }),

  academicTerm: Joi.string()
    .required()
    .messages({
      'any.required': 'Academic term is required',
    }),

  duration: Joi.string()
    .required()
    .messages({
      'any.required': 'Exam duration is required',
    }),

  examDate: Joi.date()
    .required()
    .messages({
      'any.required': 'Exam date is required',
      'date.base': 'Invalid exam date format',
    }),

  examTime: Joi.string()
    .required()
    .messages({
      'any.required': 'Exam time is required',
    }),

  examType: Joi.string()
    .required()
    .messages({
      'any.required': 'Exam type is required',
    }),

  examStatus: Joi.string()
    .valid('pending', 'live')
    .required()
    .messages({
      'any.required': 'Exam status is required',
      'string.valid': 'Invalid exam status',
    }),

  questions: Joi.array().items(Joi.string()),

  classLevel: Joi.string()
    .required()
    .messages({
      'any.required': 'Class level is required',
    }),

  createdBy: Joi.string()
    .required()
    .messages({
      'any.required': 'Created by teacher is required',
    }),

  academicYear: Joi.string()
    .required()
    .messages({
      'any.required': 'Academic year is required',
    }),

}).options({ stripUnknown: true });

const examUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.min': 'Exam name must be at least {#limit} characters long',
      'string.max': 'Exam name cannot exceed {#limit} characters',
    }),

  description: Joi.string(),

  subject: Joi.string(),

  program: Joi.string(),

  academicTerm: Joi.string(),

  duration: Joi.string(),

  examDate: Joi.date()
    .messages({
      'date.base': 'Invalid exam date format',
    }),

  examTime: Joi.string(),

  examType: Joi.string(),

  classLevel: Joi.string(),

}).options({ stripUnknown: true });

module.exports = { examValidationSchema, examUpdateSchema };
