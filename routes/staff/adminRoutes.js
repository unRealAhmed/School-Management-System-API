const express = require('express')
const { getAdminProfile, getAllAdmins, signupAdmin, loginAdmin, protect, restrictTo, updateAdminData, updateAdminPassword } = require('../../controllers/staff/adminController')

const router = express.Router()

router.post('/signup', signupAdmin)
router.post('/login', loginAdmin)

router.use(protect, restrictTo('admin'))

router.route('/').get(getAllAdmins)
router.route('/:id').get(getAdminProfile)
router.route('/updateAdmin').patch(updateAdminData)
router.route('/updateAdminPassword').patch(updateAdminPassword)

module.exports = router
