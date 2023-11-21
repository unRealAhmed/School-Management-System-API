const Student = require('../../models/Academic/Student')
const asyncHandler = require('../../utils/asyncHandler')
const AppError = require('../../utils/appErrors')
const createToken = require('../../utils/createToken')
const ExamResult = require('../../models/Academic/ExamResults')
const Exam = require('../../models/Academic/Exam')



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
  const {
    classLevels,
    academicYear,
    program,
    name,
    email,
    prefectName,
    isSuspended,
    isWithdrawn,
  } = req.body;

  //find the student by id
  const studentFound = await Student.findById(req.params.studentId);
  if (!studentFound) {
    return next(new AppError("Student not found"))
  }

  //update
  const studentUpdated = await Student.findByIdAndUpdate(
    req.params.studentId,
    {
      $set: {
        name,
        email,
        academicYear,
        program,
        prefectName,
        isSuspended,
        isWithdrawn,
      },
      $addToSet: {
        classLevels,
      },
    },
    {
      new: true,
    }
  );
  //send response
  res.status(200).json({
    status: "success",
    studentUpdated,
  });
});


exports.writeExam = asyncHandler(async (req, res, next) => {
  //get student
  const studentFound = await Student.findById(req.user.id);
  if (!studentFound) {
    return next(new AppError("Student not found"))
  }
  //Get exam
  const examFound = await Exam.findById(req.params.examId)
    .populate("questions")
    .populate("academicTerm");

  if (!examFound) {
    return (new AppError("Exam not found"))
  }
  //get questions
  const { questions } = examFound;
  //get students questions
  const studentAnswers = req.body.answers;

  //check if student answered all questions
  if (studentAnswers.length !== questions.length) {
    return next(new AppError("You have not answered all the questions"))
  }

  // //check if student has already taken the exams
  const studentFoundInResults = await ExamResult.findOne({
    student: studentFound.id,
  });
  if (studentFoundInResults) {
    return next(new AppError("You have already written this exam"))
  }

  //check if student is suspende/withdrawn
  if (studentFound.isWithdrawn || studentFound.isSuspended) {
    return next(new AppError("You are suspended/withdrawn, you can't take this exam"))
  }

  //Build report object
  let correctanswers = 0;
  let status = ""; //failed/passed
  let grade = 0;
  let remarks = "";
  let score = 0;
  let answeredQuestions = [];

  //check for answers
  for (let i = 0; i < questions.length; i += 1) {
    //find the question
    const question = questions[i];
    //check if the answer is correct
    if (question.correctAnswer === studentAnswers[i]) {
      correctanswers += 1;
      score += 1;
      question.isCorrect = true;
    }
  }
  //calculate reports
  grade = (correctanswers / questions.length) * 100;
  answeredQuestions = questions.map(({ question, correctAnswer, isCorrect }) => ({
    question,
    correctAnswer,
    isCorrect,
  }));

  //calculate status
  if (grade >= 50) {
    status = "Pass";
  } else {
    status = "Fail";
  }

  //Remarks
  if (grade >= 80) {
    remarks = "Excellent";
  } else if (grade >= 70) {
    remarks = "Very Good";
  } else if (grade >= 60) {
    remarks = "Good";
  } else if (grade >= 50) {
    remarks = "Fair";
  } else {
    remarks = "Poor";
  }

  //Generate Exam results
  const examResults = await ExamResult.create({
    student: studentFound.id,
    exam: examFound.id,
    grade,
    score,
    status,
    remarks,
    classLevel: examFound.classLevel,
    academicTerm: examFound.academicTerm,
    academicYear: examFound.academicYear,
    answeredQuestions: answeredQuestions,
  });
  // //push the results into
  studentFound.examResults.push(examResults.id);
  // //save
  await studentFound.save({ validateBeforeSave: false });

  //Promoting
  //promote student to level 200
  if (
    examFound.academicTerm.name === "3th Term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 100"
  ) {
    studentFound.classLevels.push("Level 200");
    studentFound.currentClassLevel = "Level 200";
    studentFound.isPromotedToLevel200 = true;
    await studentFound.save({ validateBeforeSave: false });
    return
  }

  //promote student to level 300
  if (
    examFound.academicTerm.name === "3th Term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 200"
  ) {
    studentFound.classLevels.push("Level 300");
    studentFound.currentClassLevel = "Level 300";
    studentFound.isPromotedToLevel300 = true
    await studentFound.save({ validateBeforeSave: false });
    return
  }

  //promote student to level 400
  if (
    examFound.academicTerm.name === "3th Term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 300"
  ) {
    studentFound.classLevels.push("Level 400");
    studentFound.currentClassLevel = "Level 400";
    studentFound.isPromotedToLevel400 = true
    await studentFound.save({ validateBeforeSave: false });
    return
  }

  //promote student to graduate
  if (
    examFound.academicTerm.name === "3th Term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 400"
  ) {
    studentFound.isGraduated = true;
    studentFound.yearGraduated = new Date();
    await studentFound.save({ validateBeforeSave: false });
    return
  }

  res.status(200).json({
    status: "success",
  });
});

