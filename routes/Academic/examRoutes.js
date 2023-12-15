const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  createExam,
  getAllExams,
  getExam,
  updateExam,
} = require("../../controllers/Academic/examsController");

const { examValidationSchema, examUpdateSchema } = require("../../validation/academics/examValidation");
const validationFunction = require("../../middleware/validationFunction");

const router = express.Router();

router.use(protect, restrictTo('teacher'));

router.route("/")
  .post(validationFunction(examValidationSchema), createExam)
  .get(getAllExams);

router.route("/:id")
  .get(getExam)
  .patch(validationFunction(examUpdateSchema), updateExam);

module.exports = router;
