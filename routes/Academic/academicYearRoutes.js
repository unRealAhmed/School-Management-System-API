const express = require('express')
const { protect, restrictTo } = require('../../controllers/staff/adminController')
const { CreateAcademicYear, getAllAcademicYears, getAcademicYear, updateAcademicYear, deleteAcademicYear } = require('../../controllers/Academic/academicYearController')

const router = express.Router()

router.use(protect, restrictTo('admin'))

router.route('/').get(getAllAcademicYears).post(CreateAcademicYear)
router.route('/:id').get(getAcademicYear).patch(updateAcademicYear).delete(deleteAcademicYear)

module.exports = router
