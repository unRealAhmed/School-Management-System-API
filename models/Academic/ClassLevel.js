// Import mongoose
const mongoose = require("mongoose");

// Define ClassLevel schema
const classLevelSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Class level name is required."],
    },
    description: {
      type: String,
    },

    // Relationships
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Created by admin is required."],
    },
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
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
  },
  { timestamps: true }
);

// Indexes
classLevelSchema.index({ name: 1 });
classLevelSchema.index({ createdBy: 1, createdAt: -1 });
classLevelSchema.index({ "students": 1 });
classLevelSchema.index({ "subjects": 1 });
classLevelSchema.index({ "teachers": 1 });

// Model
const ClassLevel = mongoose.model("ClassLevel", classLevelSchema);

// Export the model
module.exports = ClassLevel;
