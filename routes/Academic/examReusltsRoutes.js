const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  checkExamResults,
  getAllExamResults,
  adminToggleExamResult,
} = require("../../controllers/Academic/examResultsController");

const router = express.Router();

router.use(protect);

router.get("/", restrictTo('student'), getAllExamResults);

router.get("/:id/checking", restrictTo('student'), checkExamResults);

router.patch("/:id/admin-toggle-publish", restrictTo('admin'), adminToggleExamResult);

module.exports = router;
