const express = require('express')
const { getAdminProfile, signupAdmin, loginAdmin, protect, restrictTo } = require('../../controllers/staff/adminController')

const router = express.Router()

router.post('/signup', signupAdmin)
router.post('/login', loginAdmin)
router.route('/:id').get(protect, restrictTo('admin'), getAdminProfile)

module.exports = router
