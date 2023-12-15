const express = require('express');
const { protect, restrictTo } = require('../../controllers/staff/adminController');
const {
  CreateAcademicYear,
  getAllAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} = require('../../controllers/Academic/academicYearController');
const { academicYearValidationSchema, academicYearUpdateSchema } = require('../../validation/academics/academicYearValidation');
const validationFunction = require('../../middleware/validationFunction');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router
  .route('/')
  .get(getAllAcademicYears)
  .post(validationFunction(academicYearValidationSchema), CreateAcademicYear);

router
  .route('/:id')
  .get(getAcademicYear)
  .patch(validationFunction(academicYearUpdateSchema), updateAcademicYear)
  .delete(deleteAcademicYear);

module.exports = router;
