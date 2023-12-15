const express = require("express");
const {
  adminRegisterStudent,
  loginStudent,
  getAllStudents,
  getStudent,
  getStudentProfile,
  updateStudentData,
  updateStudentPassword,
  adminUpdateStudent,
  writeExam
} = require("../../controllers/students/studentController");

const { protect, restrictTo } = require("../../controllers/staff/adminController");

// Import Student Validation Schemas
const {
  studentRegisterSchema,
  updateStudentProfileSchema,
  studentPasswordSchema,
} = require("../../validation/academics/studentValidation");

const validationFunction = require("../../middleware/validationFunction");

const router = express.Router();

// Public routes
router.post("/login", loginStudent);

// Student routes
router.use(protect); // Middleware for authentication

// Student-specific routes
router.patch("/updateMyPassword", validationFunction(studentPasswordSchema), restrictTo("student"), updateStudentPassword);
router.get("/profile", restrictTo("student"), getStudentProfile);
router.patch("/:studentId/update", validationFunction(updateStudentProfileSchema), restrictTo("student"), updateStudentData);
router.post("/exam/:examId/write", restrictTo("student"), writeExam);

// Admin routes
router.post("/signup-student", validationFunction(studentRegisterSchema), restrictTo("admin"), adminRegisterStudent);
router.get("/", restrictTo("admin"), getAllStudents);
router.get("/:studentId", restrictTo("admin"), getStudent);
router.patch("/:studentId/update/admin", restrictTo("admin"), adminUpdateStudent);

module.exports = router;
