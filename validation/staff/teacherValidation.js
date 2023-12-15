const Joi = require('joi');

// Teacher Profile Validation Schema
const teacherProfileSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Teacher name is required',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),

  dateEmployed: Joi.date(),

  teacherId: Joi.string(),

  isWithdrawn: Joi.boolean().default(false),

  isSuspended: Joi.boolean().default(false),

  role: Joi.string().valid('teacher').default('teacher'),

  subject: Joi.string(),

  applicationStatus: Joi.string().valid('pending', 'approved', 'rejected').default('pending'),

  program: Joi.string(),

  classLevel: Joi.string(),

  academicYear: Joi.string(),

  academicTerm: Joi.string(),

  examsCreated: Joi.array().items(Joi.string()),

  createdBy: Joi.string(),
}).options({ stripUnknown: true });

// Teacher Password Update Validation Schema
const teacherPasswordSchema = Joi.object({
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

// Update Teacher Basic Information Validation Schema
const updateTeacherBasicInfoSchema = Joi.object({
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
}).options({ stripUnknown: true });

module.exports = {
  teacherProfileSchema,
  teacherPasswordSchema,
  updateTeacherBasicInfoSchema,
};
