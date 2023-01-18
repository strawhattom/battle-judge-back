const logger = require('../utils/logger')

const httpErrorHandler = (err, req, res, _next) => {
  console.error(err.stack)
  logger.error(err.message)
  switch (err.name) {
    case 'NotFoundError':
      return res.status(err.code).send(err.message)
    case 'ValidationError':
    case 'DuplicateError':
      return res.status(400).send(err.message)
    case 'UndefinedError':
      return res.status(err.code).send(err.message)
    default:
      return res.status(500).send('Something broke!')
  }
}

module.exports = httpErrorHandler
