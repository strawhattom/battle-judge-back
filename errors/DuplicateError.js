class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateError';
    this.code = 400;
  }
}

module.exports = DuplicateError;
