const logger = require('../utils/logger');

const errorsName = [
  'NotFoundError',
  'ValidationError',
  'DuplicateError',
  'UndefinedError'
];

const httpErrorHandler = (err, req, res, next) => {
  logger.error(`${err.name} : ${err.message}`);
  if (errorsName.includes(err.name))
    return res.status(err.code).send(err.message);
  else return res.status(500).send('Something broke!');
};

module.exports = httpErrorHandler;
