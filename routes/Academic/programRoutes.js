const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  getAllPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram
} = require("../../controllers/Academic/ProgramsController");

const router = express.Router();

// Middleware for protecting and restricting routes
router.use(protect, restrictTo('admin'));

// Routes for handling program operations
router.route("/")
  .post(createProgram)
  .get(getAllPrograms);

router.route("/:id")
  .get(getProgram)
  .patch(updateProgram)
  .delete(deleteProgram);

module.exports = router;
