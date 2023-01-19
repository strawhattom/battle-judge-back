const logger = require('../utils/logger');

const httpErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  logger.error(`${err.name} : ${err.message}`);
  switch (err.name) {
    case 'NotFoundError':
      return res.status(err.code).send(err.message);
    case 'ValidationError':
      return res.status(err.code).send(err.message);
    case 'DuplicateError':
      return res.status(err.code).send(err.message);
    case 'UndefinedError':
      return res.status(err.code).send(err.message);
    default:
      return res.status(500).send('Something broke!');
  }
};

module.exports = httpErrorHandler;
