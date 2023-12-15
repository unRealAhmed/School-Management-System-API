const express = require('express');
const {
  getAdminProfile,
  getAllAdmins,
  signupAdmin,
  loginAdmin,
  protect,
  restrictTo,
  updateAdminData,
  updateAdminPassword
} = require('../../controllers/staff/adminController');
const validationFunction = require('../../middleware/validationFunction');
const {
  adminValidationSchema,
  updateProfileSchema,
  updatePasswordSchema
} = require('../../validation/staff/adminValidation');

const router = express.Router();

router.post('/signup', validationFunction(adminValidationSchema), signupAdmin);
router.post('/login', loginAdmin);

router.use(protect, restrictTo('admin'));

router.route('/').get(getAllAdmins);
router.route('/:id').get(getAdminProfile);
router.route('/updateAdmin').patch(validationFunction(updateProfileSchema), updateAdminData);
router.route('/updateMyPassword').patch(validationFunction(updatePasswordSchema), updateAdminPassword);

module.exports = router;
