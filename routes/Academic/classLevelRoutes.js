const express = require("express");
const { getAllClassLevel, getClassLevel, createClassLevel, updateClassLevel, deleteClassLevel } = require("../../controllers/Academic/classLevelController");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const { classLevelValidationSchema, classLevelUpdateSchema } = require("../../validation/academics/classLevelValidation");
const validationFunction = require("../../middleware/validationFunction");

const router = express.Router();

router.use(protect, restrictTo('admin'))

router
  .route("/")
  .post(validationFunction(classLevelValidationSchema), createClassLevel)
  .get(getAllClassLevel);

router
  .route("/:id")
  .get(getClassLevel)
  .patch(validationFunction(classLevelUpdateSchema), updateClassLevel)
  .delete(deleteClassLevel);

module.exports = router;
