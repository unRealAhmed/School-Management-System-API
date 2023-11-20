const express = require("express");
const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  createAcademicTerm,
  getAcademicTerms,
  getAcademicTerm,
  updateAcademicTerm,
  deleteAcademicTerm,
} = require("../../controllers/Academic/academicTermController");

const router = express.Router();

router.use(protect, restrictTo("admin"))

router
  .route("/")
  .post(createAcademicTerm)
  .get(getAcademicTerms);

router
  .route("/:id")
  .get(getAcademicTerm)
  .patch(updateAcademicTerm)
  .delete(deleteAcademicTerm);


module.exports = router;
