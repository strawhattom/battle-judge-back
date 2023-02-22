class UndefinedError extends Error {
  constructor(message = 'Undefined Error') {
    super(message);
    this.name = 'UndefinedError';
    this.code = 400;
  }
}

module.exports = UndefinedError;
