const mongoose = require("mongoose");

// Exam Schema
const examSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Exam name is required."],
    },
    description: {
      type: String,
      required: [true, "Exam description is required."],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject is required."],
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: [true, "Program is required."],
    },
    passMark: {
      type: Number,
      required: [true, "Pass mark is required."],
      default: 50,
    },
    totalMark: {
      type: Number,
      required: [true, "Total mark is required."],
      default: 100,
    },

    // Time and Duration
    academicTerm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicTerm",
      required: [true, "Academic term is required."],
    },
    duration: {
      type: String,
      required: [true, "Exam duration is required."],
      default: "30 minutes",
    },
    examDate: {
      type: Date,
      required: [true, "Exam date is required."],
      default: new Date(),
    },
    examTime: {
      type: String,
      required: [true, "Exam time is required."],
    },

    // Exam Details
    examType: {
      type: String,
      required: [true, "Exam type is required."],
      default: "Quiz",
    },
    examStatus: {
      type: String,
      required: [true, "Exam status is required."],
      default: "pending",
      enum: ["pending", "live"],
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    // Relationships
    classLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassLevel",
      required: [true, "Class level is required."],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Created by teacher is required."],
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: [true, "Academic year is required."],
    },
  },
  { timestamps: true }
);

examSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'questions',
    select: '-createdAt -updatedAt',
    populate: {
      path: 'createdBy',
      select: 'name'
    }
  })
  next()
})

// Model
const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
