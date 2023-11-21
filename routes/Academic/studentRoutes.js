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
} = require("../../controllers/students/studentController");

const { protect, restrictTo } = require("../../controllers/staff/adminController");

const router = express.Router();

// Public routes
router.post("/login", loginStudent);

// student routes
router.use(protect); // Middleware for authentication

// student-specific routes
router.patch("/updateMyPassword", restrictTo("student"), updateStudentPassword);
router.get("/profile", restrictTo("student"), getStudentProfile);
router.patch("/:studentId/update", restrictTo("student"), updateStudentData);

// Admin routes
router.post("/signup-student", restrictTo("admin"), adminRegisterStudent);
router.get("/", restrictTo("admin"), getAllStudents);
router.get("/:studentId", restrictTo("admin"), getStudent);
router.patch("/:studentId/update/admin", restrictTo("admin"), adminUpdateStudent);

module.exports = router;
