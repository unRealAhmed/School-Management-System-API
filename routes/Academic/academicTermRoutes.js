const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  createAcademicTerm,
  getAcademicTerms,
  getAcademicTerm,
  updateAcademicTerm,
  deleteAcademicTerm,
} = require("../../controllers/Academic/academicTermController");
const validationFunction = require('../../middleware/validationFunction');
const { academicTermValidationSchema, academicTermUpdateSchema } = require('../../validation/academics/academicTermValidation');

const router = express.Router();

router.use(protect, restrictTo("admin"));

router
  .route("/")
  .post(validationFunction(academicTermValidationSchema), createAcademicTerm)
  .get(getAcademicTerms);

router
  .route("/:id")
  .get(getAcademicTerm)
  .patch(validationFunction(academicTermUpdateSchema), updateAcademicTerm)
  .delete(deleteAcademicTerm);

module.exports = router;
