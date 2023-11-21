const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  createExam,
  getAllExams,
  getExam,
  updateExam,
} = require("../../controllers/Academic/examsController");

const router = express.Router();

// Middleware for authentication and role restriction to 'teacher'
router.use(protect, restrictTo('teacher'));


router.route("/")
  .post(createExam)
  .get(getAllExams);

router.route("/:id")
  .get(getExam)
  .patch(updateExam);

module.exports = router;
