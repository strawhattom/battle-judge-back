const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf } = format;
require('dotenv/config');

const LOG_FILENAME = 'battle-judge.log';

const outFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if (metadata && metadata.length > 0) msg += JSON.stringify(metadata);
  return msg;
});

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

const logger = createLogger({
  levels,
  format: combine(
    format.colorize(),
    splat(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    outFormat
  ),
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({ filename: LOG_FILENAME, level: 'debug' })
  ]
});

module.exports = logger;
