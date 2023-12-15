const Joi = require('joi');

// Admin Validation Schema
const adminValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name cannot exceed {#limit} characters',
      'any.required': 'Name is required',
    }),

  email: Joi.string()
    .email()
    .max(100)
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'string.max': 'Email cannot exceed {#limit} characters',
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

  role: Joi.string().valid('admin').default('admin'),

  academicTerms: Joi.array().items(Joi.string()).optional(),

  programs: Joi.array().items(Joi.string()).optional(),

  yearGroups: Joi.array().items(Joi.string()).optional(),

  academicYears: Joi.array().items(Joi.string()).optional(),

  classLevels: Joi.array().items(Joi.string()).optional(),

  teachers: Joi.array().items(Joi.string()).optional(),

  students: Joi.array().items(Joi.string()).optional(),

}).options({ stripUnknown: true });

// Update Profile Schema
const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name cannot exceed {#limit} characters',
    }),

  email: Joi.string()
    .email()
    .max(100)
    .optional()
    .messages({
      'string.email': 'Invalid email format',
      'string.max': 'Email cannot exceed {#limit} characters',
    }),
}).options({ stripUnknown: true });

// Update Password Schema
const updatePasswordSchema = Joi.object({
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
  adminValidationSchema,
  updateProfileSchema,
  updatePasswordSchema,
};
