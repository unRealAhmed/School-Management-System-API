const express = require("express");
const {
  adminRegisterTeacher,
  loginTeacher,
  getAllTeachers,
  getTeacher,
  getTeacherProfile,
  updateTeacherData,
  updateTeacherPassword,
  adminUpdateTeacher,
} = require("../../controllers/staff/teacherController");

const { protect, restrictTo } = require("../../controllers/staff/adminController");

const router = express.Router();

// Public routes
router.post("/login", loginTeacher);

// Teacher routes
router.use(protect); // Middleware for authentication

// Teacher-specific routes
router.patch("/updateMyPassword", restrictTo("teacher"), updateTeacherPassword);
router.get("/profile", restrictTo("teacher"), getTeacherProfile);
router.patch("/:teacherId/update", restrictTo("teacher"), updateTeacherData);

// Admin routes
router.post("/signup-teacher", restrictTo("admin"), adminRegisterTeacher);
router.get("/", restrictTo("admin"), getAllTeachers);
router.get("/:teacherId", restrictTo("admin"), getTeacher);
router.patch("/:teacherId/update/admin", restrictTo("admin"), adminUpdateTeacher);

module.exports = router;
