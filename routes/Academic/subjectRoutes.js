const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} = require("../../controllers/Academic/subjectsController");

const router = express.Router();

// Middleware for protecting and restricting routes
router.use(protect, restrictTo('admin'));

// Routes for handling subject operations
router.route("/")
  .post(createSubject)
  .get(getAllSubjects);

router.route("/:id")
  .get(getSubject)
  .patch(updateSubject)
  .delete(deleteSubject);

module.exports = router;
