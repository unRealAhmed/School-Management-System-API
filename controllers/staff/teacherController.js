const Teacher = require("../../models/Staff/Teacher");
const asyncHandler = require('../../utils/asyncHandler')
const AppError = require('../../utils/appErrors')
const createToken = require('../../utils/createToken')


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

exports.adminRegisterTeacher = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  //check if teacher already exists
  const teacherFound = await Teacher.findOne({ email });
  if (teacherFound) {
    return next(new AppError("Teacher already employed"))
  }
  // create
  const newTeacher = await Teacher.create({
    name,
    email,
    password,
    passwordConfirm
  });

  newTeacher.password = undefined
  //send teacher data
  sendTokenResponse(res, newTeacher, 201);
});

//LOGIN Teacher 
exports.loginTeacher = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide valid email and password.', 400));
  }

  const teacher = await Teacher.findOne({ email }).select('+password');

  if (!teacher) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if the provided password matches the stored hashed password
  const isPasswordCorrect = await teacher.passwordMatching(password, teacher.password);

  if (!isPasswordCorrect) {
    return next(new AppError('Invalid email or password', 401));
  }

  teacher.password = undefined;

  sendTokenResponse(res, teacher, 200);
});


exports.getAllTeachers = asyncHandler(async (req, res, next) => {
  const teachers = await Teacher.find();
  res.status(200).json({
    status: "success",
    teachers
  });
});

exports.getTeacher = asyncHandler(async (req, res, next) => {
  const { teacherId } = req.params;
  //find the teacher
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    return next(new AppError("Teacher not found"))
  }

  res.status(200).json({
    status: "success",
    teacher,
  });
});

exports.getTeacherProfile = asyncHandler(async (req, res, next) => {
  const teacher = await Teacher.findById(req.user.id)
  if (!teacher) {
    return next(new AppError("Teacher not found"))
  }
  res.status(200).json({
    status: "success",
    teacher,
  });
});

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

// Update teacher data except for password
exports.updateTeacherData = asyncHandler(async (req, res, next) => {
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

  const updatedTeacher = await Teacher.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    updatedTeacher
  });
});

//UPDATE PASSWORD
exports.updateTeacherPassword = asyncHandler(async (req, res, next) => {

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(new AppError('Please provide both values', 400))
  }

  // 1) Find the teacher by ID and select the password field
  const teacher = await Teacher.findById(req.user._id).select("+password");
  // 2) Check if the entered current password is correct
  const isPasswordCorrect = await teacher.passwordMatching(
    oldPassword,
    teacher.password
  );

  if (!isPasswordCorrect) {
    return next(new AppError("Your current password is incorrect", 401));
  }
  // 3) Update the teacher's password with the new one and save the changes
  teacher.password = req.body.newPassword;
  teacher.passwordConfirm = req.body.passwordConfirm;
  await teacher.save();

  teacher.password = undefined;

  sendTokenResponse(res, teacher, 200);
});

//update but by admin
exports.adminUpdateTeacher = asyncHandler(async (req, res, next) => {
  const { program, classLevel, academicYear, subject } = req.body;
  const { teacherId } = req.params;

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    return next(new AppError("Teacher not found"));
  }

  // Check if teacher is withdrawn
  if (teacher.isWithdrawn) {
    return next(new AppError("Action denied, teacher is withdrawn"));
  }

  // Update properties if provided
  if (program) teacher.program = program;
  if (classLevel) teacher.classLevel = classLevel;
  if (academicYear) teacher.academicYear = academicYear;
  if (subject) teacher.subject = subject;

  await teacher.save({ validateBeforeSave: false });

  // Respond with success
  res.status(200).json({
    status: "success",
    teacher,
    message: "Teacher updated successfully",
  });
});

