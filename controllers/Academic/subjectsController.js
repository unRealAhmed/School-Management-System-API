const Admin = require("../../models/Staff/Admin");
const asyncHandler = require("../../utils/asyncHandler");
const Subject = require("../../models/Academic/Subject");
const AppError = require("../../utils/appErrors");
const Program = require("../../models/Academic/Program");


exports.createSubject = asyncHandler(async (req, res, next) => {
  const { name, description, academicTerm } = req.body;
  const createdBy = req.user.id
  //find the program
  const programFound = await Program.findById(req.params.programId);
  if (!programFound) {
    return next(new AppError("Program  not found", 404))
  }
  //check if exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    return next(new AppError("subject  already exists"))
  }
  //create
  const subjectCreated = await Subject.create({
    name,
    description,
    academicTerm,
    createdBy
  });
  //push program into admin
  const admin = await Admin.findById(createdBy);
  admin.programs.push(subjectCreated._id);
  //save
  await admin.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "success",
    subjectCreated,
  });
});

exports.getAllSubjects = asyncHandler(async (req, res, next) => {
  const subjects = await Subject.find();
  res.status(200).json({
    status: "success",
    subjects,
  });
});

exports.getSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return next(new AppError('No subject with that id', 404))
  }

  res.status(200).json({
    status: "success",
    subject,
  });
});

exports.updateSubject = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  //check name exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) {
    return next(new AppError("subject  already exists"))
  }
  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      createdBy: req.user.id,
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!subject) {
    return next(new AppError('No subject with that id', 404))
  }

  res.status(200).json({
    status: "success",
    subject,
  });
});

exports.deleteSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findByIdAndDelete(req.params.id);

  if (!subject) {
    return next(new AppError('No subject with that id', 404))
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});
