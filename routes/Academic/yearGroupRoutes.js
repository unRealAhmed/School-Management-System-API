const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  getAllYearGroups,
  getYearGroup,
  createYearGroup,
  updateYearGroup,
  deleteYearGroup
} = require("../../controllers/Academic/yearGroupsController");

const router = express.Router();

// Middleware for protecting and restricting routes
router.use(protect, restrictTo('admin'));

// Routes for handling subject operations
router.route("/")
  .post(createYearGroup)
  .get(getAllYearGroups);

router.route("/:id")
  .get(getYearGroup)
  .patch(updateYearGroup)
  .delete(deleteYearGroup);

module.exports = router;
