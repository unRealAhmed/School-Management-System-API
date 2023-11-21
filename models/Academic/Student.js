const mongoose = require("mongoose");
const { default: validator } = require("validator");
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
  {
    // Personal Information
    name: {
      type: String,
      required: [true, "Student name is required."],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide your email address'],
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // Custom validation to check if password and passwordConfirm match
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    // Unique Identifier
    studentId: {
      type: String,
      required: [true, "Student ID is required."],
      default: function () {
        return (
          `STU${Math.floor(100 + Math.random() * 900)}${Date.now().toString().slice(2, 4)}${this.name
            .split(" ")
            .map(name => name[0])
            .join("")
            .toUpperCase()}`
        );
      },
    },

    // Role and Relationships
    role: {
      type: String,
      default: "student",
    },
    classLevels: [
      {
        type: String
      },
    ],
    currentClassLevel: {
      type: String,
      default: function () {
        return this.classLevels[this.classLevels.length - 1];
      },
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
    },
    dateAdmitted: {
      type: Date,
      default: Date.now,
    },

    // Exam Results
    examResults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExamResult",
      },
    ],

    // Program Information
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },

    // Promotion and Graduation
    isPromotedToLevel200: {
      type: Boolean,
      default: false,
    },
    isPromotedToLevel300: {
      type: Boolean,
      default: false,
    },
    isPromotedToLevel400: {
      type: Boolean,
      default: false,
    },
    isGraduated: {
      type: Boolean,
      default: false,
    },

    // Student Status
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },

    // Prefect Information
    prefectName: {
      type: String,
    },

    // Graduation Information
    yearGraduated: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// COMPARING PASSWORDS
studentSchema.methods.passwordMatching = async function (enteredPassword, userPassword) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

// HASH PASSWORD before saving the user
studentSchema.pre('save', async function (next) {
  // Check if the password field has been modified
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt with a cost factor of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    // Set passwordConfirm to undefined as it's no longer needed
    this.passwordConfirm = undefined;

    // Update passwordChangedAt if it's not a new user
    if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;

    next();
  } catch (error) {
    return next(error);
  }
});

// PASSWORD CHANGE CHECK
studentSchema.methods.changedPasswordAfter = function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    // Convert passwordChangedAt timestamp to seconds
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return tokenIssuedAt < changedTimestamp;
  }
  return false;
};

// Model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
