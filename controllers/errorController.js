const AppError = require('../utils/appErrors');

// Handle Error Functions

// Handle casting errors, e.g., invalid data type for a field.
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle validation errors, e.g., validation constraints not met.
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handle JSON Web Token (JWT) validation errors.
const handleJsonWebTokenError = () =>
  new AppError("Invalid token, please login again", 401);

// Handle token expiration errors.
const handleTokenExpiredError = () =>
  new AppError("Token has expired, please login again", 401);

// Send Response Functions

// Send detailed error response in the development environment.
const sendDevErr = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    stack: err.stack,
    message: err.message,
    error: err,
  });
};

// Send simplified error response in the production environment.
const sendProdErr = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: "error",
      message: "Something went very wrong",
      error: err,
    });
  }
};

// Error Controller

// Centralized error handling middleware.
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevErr(err, res);
  }

  if (process.env.NODE_ENV === "production") {
    let error = JSON.parse(JSON.stringify(err))
    error.message = err.message
    if (error.name === "CastError") error = handleCastError(error);
    if (error.name === "ValidationError") error = handleValidationError(error);
    if (error.name === "JsonWebTokenError") error = handleJsonWebTokenError(error);
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError(error);

    sendProdErr(error, res);
  }
};