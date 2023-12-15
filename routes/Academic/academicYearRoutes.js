const express = require('express');
const { protect, restrictTo } = require('../../controllers/staff/adminController');
const {
  createAcademicYear,
  getAllAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} = require('../../controllers/Academic/academicYearController');
const { academicYearValidationSchema, academicYearUpdateSchema } = require('../../validation/academics/academicYearValidation');
const validate = require('../../middleware/validationFunction');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.route('/')
  .get(getAllAcademicYears)
  .post(validate(academicYearValidationSchema), createAcademicYear);

router.route('/:id')
  .get(getAcademicYear)
  .patch(validate(academicYearUpdateSchema), updateAcademicYear)
  .delete(deleteAcademicYear);

module.exports = router;
