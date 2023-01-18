class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.code = 400;
  }
}

module.exports.ValidationError = ValidationError;
