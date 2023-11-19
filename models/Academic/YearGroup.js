const mongoose = require("mongoose");

const yearGroupSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Year group name is required."],
    },

    // Relationships
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Created by admin is required."],
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: [true, "Academic year is required."],
    },
  },
  {
    timestamps: true,
  }
);

// Model
const YearGroup = mongoose.model("YearGroup", yearGroupSchema);

module.exports = YearGroup;
