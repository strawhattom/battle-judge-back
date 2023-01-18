const logger = require('winston')

module.exports = function (err, req, res, next) {
  console.log('ERRORRRRRRRRRRRRRRR')
  return res.status(500).send('Error !')
}
