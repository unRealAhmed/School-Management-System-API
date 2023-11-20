const express = require("express");
const { getAllClassLevel, getClassLevel, createClassLevel, updateClassLevel, deleteClassLevel } = require("../../controllers/Academic/classLevelController");
const { protect, restrictTo } = require("../../controllers/staff/adminController");

const router = express.Router();

router.use(protect, restrictTo('admin'))

router
  .route("/")
  .post(createClassLevel)
  .get(getAllClassLevel);

router
  .route("/:id")
  .get(getClassLevel)
  .patch(updateClassLevel)
  .delete(deleteClassLevel);


module.exports = router;
