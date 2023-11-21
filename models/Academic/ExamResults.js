const mongoose = require("mongoose");

// Exam Result Schema
const examResultSchema = new mongoose.Schema(
  {
    // Student and Exam Information
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required."],
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Exam is required."],
    },
    // Result Details
    grade: {
      type: Number,
      required: [true, "Grade is required."],
    },
    score: {
      type: Number,
      required: [true, "Score is required."],
    },
    passMark: {
      type: Number,
      required: [true, "Pass mark is required."],
      default: 50,
    },
    status: {
      type: String,
      required: [true, "Status is required."],
      enum: ["Fail", "Pass"],
      default: "Fail",
    },
    remarks: {
      type: String,
      required: [true, "Remarks are required."],
      enum: ["Excellent", "Good", "Poor"],
      default: "Poor",
    },
    // Subject and Class Information
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    classLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassLevel",
    },
    academicTerm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicTerm",
      required: [true, "Academic term is required."],
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: [true, "Academic year is required."],
    },

    // Status
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Model
const ExamResult = mongoose.model("ExamResult", examResultSchema);

module.exports = ExamResult;
