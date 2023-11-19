const mongoose = require("mongoose");
const { default: validator } = require("validator");

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
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassLevel",
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

// Model
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
