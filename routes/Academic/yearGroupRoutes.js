const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  getAllYearGroups,
  getYearGroup,
  createYearGroup,
  updateYearGroup,
  deleteYearGroup
} = require("../../controllers/Academic/yearGroupsController");

const validationFunction = require('../../middleware/validationFunction');
const { yearGroupValidationSchema, yearGroupUpdateSchema } = require('../../validation/academics/yearGroupValidation');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.route("/")
  .post(validationFunction(yearGroupValidationSchema), createYearGroup)
  .get(getAllYearGroups);

router.route("/:id")
  .get(getYearGroup)
  .patch(validationFunction(yearGroupUpdateSchema), updateYearGroup)
  .delete(deleteYearGroup);

module.exports = router;
