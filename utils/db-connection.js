require('dotenv/config')
const Sequelize = require('sequelize')
const logger = require('./logger') // Logger

try {
  const sequelize = new Sequelize(process.env.MARIADB_URI, {
    logging: false
  })
  module.exports = sequelize
} catch (err) {
  logger.error('Could not connect to db')
  process.exit()
}
