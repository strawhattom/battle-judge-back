class UndefinedError extends Error {
  constructor() {
    super('Undefined parameters !')
    this.name = 'UndefinedError'
    this.code = 400
  }
}

module.exports = UndefinedError
