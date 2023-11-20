const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Program name is required."],
    },
    description: {
      type: String,
      required: [true, "Program description is required."],
    },
    duration: {
      type: String,
      default: "4 years",
    },

    // Code Generation
    code: {
      type: String,
      default: function () {
        return (
          this.name
            .split(" ")
            .map(name => name[0])
            .join("")
            .toUpperCase() +
          Math.floor(10 + Math.random() * 90) +
          Math.floor(10 + Math.random() * 90)
        );
      },
    },

    // Relationships
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Created by admin is required."],
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", programSchema);

module.exports = Program;
