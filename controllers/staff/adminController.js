const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const Admin = require('../../models/Staff/Admin')
const asyncHandler = require('../../utils/asyncHandler')
const AppError = require('../../utils/appErrors')
const createToken = require('../../utils/createToken')
const Teacher = require('../../models/Staff/Teacher')
const Student = require('../../models/Academic/Student')

// Helper function to send JWT token as a response
const sendTokenResponse = (res, user, statusCode) => {
  // Create a JWT token 
  const token = createToken(res, user);

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

//SIGNUP ADMIN
exports.signupAdmin = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body

  const adminFound = await Admin.findOne({ email })
  if (adminFound) {
    return next(new AppError('Admin already exist!', 400))
  }

  const newAdmin = await Admin.create({
    name,
    email,
    password,
    passwordConfirm
  })

  newAdmin.password = undefined

  sendTokenResponse(res, newAdmin, 201);
})


//LOGIN ADMIN
exports.loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide valid email and password.', 400));
  }

  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if the provided password matches the stored hashed password
  const isPasswordCorrect = await admin.passwordMatching(password, admin.password);

  if (!isPasswordCorrect) {
    return next(new AppError('Invalid email or password', 401));
  }

  admin.password = undefined;

  sendTokenResponse(res, admin, 200);
});

//LOGOUT
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: new Date(Date.now() + 5 * 1000), // Set the cookie to expire in 5 seconds
  });

  res.status(200).json({ status: "success", message: 'You have been logged out.' });
};

exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Get the token from the request's authorization header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 3) Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

  // 4) Check the type of user (Admin, Teacher, or Student)
  let currentUser;

  if (decoded.role === 'admin') {
    currentUser = await Admin.findById(decoded.id);
  } else if (decoded.role === 'teacher') {
    currentUser = await Teacher.findById(decoded.id);
  } else if (decoded.role === 'student') {
    currentUser = await Student.findById(decoded.id);
  }

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token no longer exists.',
        401
      )
    );
  }

  const tokenIssuedAt = decoded.iat;

  // 5) Check if the user changed the password after the token was issued
  if (currentUser.changedPasswordAfter(tokenIssuedAt)) {
    return next(
      new AppError('User recently changed the password! Please log in again.', 401)
    );
  }

  // Grant access to the protected route by attaching the user object to the request
  req.user = currentUser;
  next();
});

exports.restrictTo = (...permittedRoles) => (req, res, next) => {
  const userRole = req.user.role;

  if (permittedRoles.includes(userRole)) {
    // If the user's role is included in the permitted roles, grant access.
    next();
  } else {
    // If the user's role is not included in the permitted roles, deny access.
    const errorMessage = `You don't have permission to perform this action.`;
    return res.status(403).json({ status: 'fail', message: errorMessage });
  }
};

exports.getAdminProfile = asyncHandler(async (req, res, next) => {

  const admin = await Admin.findById(req.user.id)
  if (!admin) {
    return next(new AppError('Admin Not found!', 404))
  }

  res.status(200).json({
    status: "success",
    admin
  })
})

exports.getAllAdmins = asyncHandler(async (req, res, next) => {
  const admins = await Admin.find()

  res.status(200).json({
    status: "success",
    admins
  })
})

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    // If the property is in the list of allowed fields, add it to the new object
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// Update user data except for password
exports.updateAdminData = asyncHandler(async (req, res, next) => {
  // 1) Check if the request includes password-related fields; if so, disallow updates
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filter out any unwanted fields that should not be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedadmin = await Admin.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    updatedadmin
  });
});

//UPDATE PASSWORD
exports.updateAdminPassword = asyncHandler(async (req, res, next) => {

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(new AppError('Please provide both values', 400))
  }

  // 1) Find the admin by ID and select the password field
  const admin = await Admin.findById(req.user._id).select("+password");
  // 2) Check if the entered current password is correct
  const isPasswordCorrect = await admin.passwordMatching(
    oldPassword,
    admin.password
  );

  if (!isPasswordCorrect) {
    return next(new AppError("Your current password is incorrect", 401));
  }
  // 3) Update the admin's password with the new one and save the changes
  admin.password = req.body.newPassword;
  admin.passwordConfirm = req.body.passwordConfirm;
  await admin.save();

  admin.password = undefined;

  sendTokenResponse(res, admin, 200);
});