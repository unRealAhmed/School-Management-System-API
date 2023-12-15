const ValidationError = require('../utils/validationError');

const validationMiddleware = (validationSchema) => (req, res, next) => {
  const { error } = validationSchema.validate(req.body);

  if (error) {
    const validationErrors = error.details.map((err) => err.message);
    next(new ValidationError(validationErrors));
  } else {
    next();
  }
};

module.exports = validationMiddleware;