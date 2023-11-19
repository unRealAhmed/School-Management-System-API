const mongoose = require("mongoose");
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
    dateEmployed: {
      type: Date,
      default: Date.now,
    },

    // Unique Identifier
    teacherId: {
      type: String,
      required: [true, "Teacher ID is required."],
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
      required: [true, "Subject is required."],
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

// Model
const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
