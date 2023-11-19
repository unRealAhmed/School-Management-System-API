// Middleware function for handling asynchronous operations
const asyncHandler = (fn) => (req, res, next) => {
  // Wrap the asynchronous function in a Promise and catch any errors
  // This allows asynchronous functions to be used in route handlers without explicit error handling
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Export the asyncHandler for use in route handlers
module.exports = asyncHandler;
