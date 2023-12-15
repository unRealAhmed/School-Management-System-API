const Joi = require('joi');

// Student Registration Schema
const studentRegisterSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Student name is required',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .min(6)
    .max(255)
    .required()
    .messages({
      'string.min': 'Password must be at least {#limit} characters long',
      'string.max': 'Password cannot exceed {#limit} characters',
      'any.required': 'Password is required',
    }),

  passwordConfirm: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required',
    }),

  studentId: Joi.string(),

  classLevels: Joi.array().items(Joi.string()),

  academicYear: Joi.string(),

  program: Joi.string(),

}).options({ stripUnknown: true });

// Update Profile Schema (for name and email)
const updateStudentProfileSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Student name is required',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),

}).options({ stripUnknown: true });

// Update Password Schema
const studentPasswordSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(255)
    .required()
    .messages({
      'string.min': 'Password must be at least {#limit} characters long',
      'string.max': 'Password cannot exceed {#limit} characters',
      'any.required': 'Password is required',
    }),

  passwordConfirm: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required',
    }),

}).options({ stripUnknown: true });

module.exports = {
  studentRegisterSchema,
  updateStudentProfileSchema,
  studentPasswordSchema,
};
