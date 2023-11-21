const Student = require("../../models/Academic/Student");
const ExamResults = require("../../models/Academic/ExamResults");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/appErrors");


exports.checkExamResults = asyncHandler(async (req, res, next) => {
  //find the student
  const examResultId = req.params.id

  const studentFound = await Student.findById(req.user.id);
  if (!studentFound) {
    return next(new AppError("No Student Found"))
  }
  console.log(examResultId, req.user.id);
  //find the exam results
  const examResult = await ExamResults.findOne({
    student: studentFound.id,
    _id: examResultId,
  })
    .populate({
      path: "exam",
      populate: {
        path: "questions",
      },
    })
    .populate("classLevel")
    .populate("academicTerm")
    .populate("academicYear");
  //check if exam is published
  if (examResult.isPublished === false) {
    return next(new AppError("Exam result is not available, check out later"))
  }
  res.json({
    status: "success",
    data: examResult,
    student: studentFound,
  });
});


exports.getAllExamResults = asyncHandler(async (req, res, next) => {
  const results = await ExamResults.find().select("exam").populate("exam");
  res.status(200).json({
    status: "success",
    data: results,
  });
});


exports.adminToggleExamResult = asyncHandler(async (req, res, next) => {
  //find the exam Results
  const examResult = await ExamResults.findById(req.params.id);
  if (!examResult) {
    return next(new AppError("Exam result not foound"))
  }
  const publishResult = await ExamResults.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: publishResult,
  });
});
