const mongoose = require("mongoose");

const academicTermSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Academic term name is required."],
    },
    description: {
      type: String,
      required: [true, "Academic term description is required."],
    },
    duration: {
      type: String,
      default: "3 months",
    },

    // Relationships
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Created by admin is required."],
    },
  },
  { timestamps: true }
);

// Model
const AcademicTerm = mongoose.model("AcademicTerm", academicTermSchema);

module.exports = AcademicTerm;
