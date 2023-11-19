// Custom error class to handle operational errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;

    // Determine the error status type ('fail' for client errors, 'error' for server errors)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Mark the error as operational (for distinction in error handling)
    this.isOperational = true;

    // Capture the stack trace for debugging purposes
    Error.captureStackTrace(this, this.constructor);
  }
}

// Export the AppError class for use in the application
module.exports = AppError;
