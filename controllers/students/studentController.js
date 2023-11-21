const Student = require('../../models/Academic/Student')
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

exports.adminRegisterStudent = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  //check if student already exists
  const studentFound = await Student.findOne({ email });
  if (studentFound) {
    return next(new AppError("student already exist"))
  }
  // create
  const newStudent = await Student.create({
    name,
    email,
    password,
    passwordConfirm
  });

  newStudent.password = undefined
  //send Studuent data
  sendTokenResponse(res, newStudent, 201);
});

//LOGIN Studuent 
exports.loginStudent = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide valid email and password.', 400));
  }

  const student = await Student.findOne({ email }).select('+password');

  if (!student) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if the provided password matches the stored hashed password
  const isPasswordCorrect = await student.passwordMatching(password, student.password);

  if (!isPasswordCorrect) {
    return next(new AppError('Invalid email or password', 401));
  }

  student.password = undefined;

  sendTokenResponse(res, student, 200);
});


exports.getAllStudents = asyncHandler(async (req, res, next) => {
  const students = await Student.find();
  res.status(200).json({
    status: "success",
    students
  });
});

exports.getStudent = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  //find the student
  const student = await Student.findById(studentId);
  if (!student) {
    return next(new AppError("Student not found"))
  }

  res.status(200).json({
    status: "success",
    student,
  });
});

exports.getStudentProfile = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.user.id)
  if (!student) {
    return next(new AppError("student not found"))
  }
  res.status(200).json({
    status: "success",
    student,
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

// Update student data except for password
exports.updateStudentData = asyncHandler(async (req, res, next) => {
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

  const updatedStudent = await Student.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    updatedStudent
  });
});

//UPDATE PASSWORD
exports.updateStudentPassword = asyncHandler(async (req, res, next) => {

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(new AppError('Please provide both values', 400))
  }

  // 1) Find the student by ID and select the password field
  const student = await Student.findById(req.user._id).select("+password");
  // 2) Check if the entered current password is correct
  const isPasswordCorrect = await student.passwordMatching(
    oldPassword,
    student.password
  );

  if (!isPasswordCorrect) {
    return next(new AppError("Your current password is incorrect", 401));
  }
  // 3) Update the student's password with the new one and save the changes
  student.password = req.body.newPassword;
  student.passwordConfirm = req.body.passwordConfirm;
  await student.save();

  student.password = undefined;

  sendTokenResponse(res, student, 200);
});

exports.adminUpdateStudent = asyncHandler(async (req, res, next) => {
  // Destructure request body and parameters
  const { classLevels, academicYear, program, name, email, prefectName } = req.body;
  const { studentId } = req.params;

  // Find the student by ID
  const studentFound = await Student.findById(studentId);
  if (!studentFound) {
    return next(new AppError('Student not found', 404));
  }

  // Update the student
  const studentUpdate = {
    name,
    email,
    academicYear,
    program,
    prefectName,
  };

  // Add classLevels to the student using $addToSet
  if (classLevels && Array.isArray(classLevels) && classLevels.length > 0) {
    studentUpdate.$addToSet = {
      classLevels: { $each: classLevels },
    };
  }

  // Execute the update query
  const updatedStudent = await Student.findByIdAndUpdate(
    studentId,
    { $set: studentUpdate },
    {
      new: true,
      runValidators: true,
    }
  );

  // Send response
  res.status(200).json({
    status: 'success',
    studentUpdated: updatedStudent,
  });
});