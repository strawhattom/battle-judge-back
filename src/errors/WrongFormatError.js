class WrongFormatError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WrongFormatError';
    this.code = 404;
  }
}
module.exports = WrongFormatError;
