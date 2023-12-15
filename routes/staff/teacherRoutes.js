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

const validationFunction = require("../../middleware/validationFunction");
const {
  teacherProfileSchema,
  teacherPasswordSchema,
  updateTeacherBasicInfoSchema,
} = require("../../validation/staff/teacherValidation");

const router = express.Router();

// Public routes
router.post("/login", loginTeacher);

router.use(protect);

// Teacher-specific routes
router.patch("/updateMyPassword", validationFunction(teacherPasswordSchema), restrictTo("teacher"), updateTeacherPassword);
router.get("/profile", restrictTo("teacher"), getTeacherProfile);
router.patch("/:teacherId/update", validationFunction(updateTeacherBasicInfoSchema), restrictTo("teacher"), updateTeacherData);

// Admin routes
router.post("/signup-teacher", validationFunction(teacherProfileSchema), restrictTo("admin"), adminRegisterTeacher);
router.get("/", restrictTo("admin"), getAllTeachers);
router.get("/:teacherId", restrictTo("admin"), getTeacher);
router.patch("/:teacherId/update/admin", validationFunction(teacherProfileSchema), restrictTo("admin"), adminUpdateTeacher);

module.exports = router;
