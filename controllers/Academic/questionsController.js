const Exam = require("../../models/Academic/Exam");
const Question = require("../../models/Academic/Questions");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/appErrors");


exports.createQuestion = asyncHandler(async (req, res, next) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;
  //find the exam
  const examFound = await Exam.findById(req.params.examId);
  if (!examFound) {
    return next(new AppError("Exam not found"))
  }
  //check if question
  const questionExists = await Question.findOne({ question });
  if (questionExists) {
    return next(new AppError("Question already exists"));
  }
  //create exam
  const questionCreated = await Question.create({
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    createdBy: req.user.id,
  });
  //add the question into exam
  examFound.questions.push(questionCreated.id);
  //save
  await examFound.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "success",
    questionCreated,
  });
});

exports.getAllQuestions = asyncHandler(async (req, res, next) => {
  const questions = await Question.find();
  res.status(200).json({
    status: "success",
    questions,
  });
});

exports.getQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new AppError('No Question with that id !', 404))
  }

  res.status(200).json({
    status: "success",
    question,
  });
});

exports.updateQuestion = asyncHandler(async (req, res, next) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } =
    req.body;
  //check name exists
  const questionFound = await Question.findOne({ question });
  if (questionFound) {
    return next(new AppError("Question already exists"))
  }
  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      createdBy: req.user.id,
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedQuestion) {
    return next(new AppError('No Question with that id !', 404))
  }

  res.status(201).json({
    status: "success",
    updatedQuestion,
  });
});
