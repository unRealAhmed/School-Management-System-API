const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const { default: validator } = require("validator");

const teacherSchema = new mongoose.Schema(
  {
    // Personal Information
    name: {
      type: String,
      required: [true, "Teacher name is required."],
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
      select: false
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
    dateEmployed: {
      type: Date,
      default: Date.now,
    },

    // Unique Identifier
    teacherId: {
      type: String,
      default: function () {
        return (
          `TEA${Math.floor(100 + Math.random() * 900)}${Date.now().toString().slice(2, 4)}${this.name
            .split(" ")
            .map(name => name[0])
            .join("")
            .toUpperCase()}`
        );
      },
    },

    // Employment Status
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },

    // Role and Relationships
    role: {
      type: String,
      default: "teacher",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Teaching Assignments
    program: {
      type: String,
    },
    classLevel: {
      type: String,
    },
    academicYear: {
      type: String,
    },
    academicTerm: {
      type: String,
    },

    // Exams
    examsCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],

    // Relationships
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

// COMPARING PASSWORDS
teacherSchema.methods.passwordMatching = async function (enteredPassword, userPassword) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

// HASH PASSWORD before saving the user
teacherSchema.pre('save', async function (next) {
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
teacherSchema.methods.changedPasswordAfter = function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    // Convert passwordChangedAt timestamp to seconds
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return tokenIssuedAt < changedTimestamp;
  }
  return false;
};

// Model
const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
