const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  createQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
} = require("../../controllers/Academic/questionsController");

const router = express.Router();

router.use(protect, restrictTo('teacher'))

router.post("/:examId", createQuestion);
router.get("/", getAllQuestions);
router.route('/:id').get(getQuestion).patch(updateQuestion);

module.exports = router;
