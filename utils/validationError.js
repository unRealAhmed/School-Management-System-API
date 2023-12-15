class ValidationError extends Error {
  constructor(errors) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

module.exports = ValidationError;
