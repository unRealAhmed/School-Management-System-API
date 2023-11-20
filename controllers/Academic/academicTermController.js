const Admin = require("../../models/Staff/Admin");
const asyncHandler = require("../../utils/asyncHandler");
const AcademicTerm = require("../../models/Academic/AcademicTerm");
const AppError = require("../../utils/appErrors");


exports.createAcademicTerm = asyncHandler(async (req, res, next) => {
  const { name, description, duration } = req.body;
  const createdBy = req.user.id
  //check if exists
  const academicTermFound = await AcademicTerm.findOne({ name });
  if (academicTermFound) {
    return next(new AppError("Academic term already exists"));
  }
  //create
  const newAcademicTerm = await AcademicTerm.create({
    name,
    description,
    duration,
    createdBy
  });
  //push academic into admin
  const admin = await Admin.findById(createdBy);
  admin.academicTerms.push(newAcademicTerm.id);
  await admin.save({ validateBeforeSave: false });
  res.status(201).json({
    status: "success",
    newAcademicTerm,
  });
});

exports.getAcademicTerms = asyncHandler(async (req, res, next) => {
  const academicTerms = await AcademicTerm.find();

  res.status(200).json({
    status: "success",
    academicTerms,
  });
});

exports.getAcademicTerm = asyncHandler(async (req, res, next) => {
  const academicTerm = await AcademicTerm.findById(req.params.id);

  if (!academicTerm) {
    return next(new AppError("No Academic term with that id !", 404))
  }

  res.status(200).json({
    status: "success",
    academicTerm
  });
});

exports.updateAcademicTerm = asyncHandler(async (req, res, next) => {
  const { name, description, duration } = req.body;
  //check name exists
  const AcademicTermFound = await AcademicTerm.findOne({ name });
  if (AcademicTermFound) {
    return next(new AppError("Academic term already exists"));
  }
  const academicTerm = await AcademicTerm.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      duration,
      createdBy: req.user.id,
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!academicTerm) {
    return next(new AppError("No Academic term with that id !", 404))
  }


  res.status(200).json({
    status: "success",
    academicTerm
  });
});

exports.deleteAcademicTerm = asyncHandler(async (req, res, next) => {
  const academicTerm = await AcademicTerm.findByIdAndDelete(req.params.id);

  if (!academicTerm) {
    return next(new AppError("No Academic term with that id !", 404))
  }


  res.status(204).json({
    status: "success",
    date: null
  });
});
