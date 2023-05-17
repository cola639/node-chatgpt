const logger = require('../utils/logger')

const logging = (req, res, next) => {
  logger.http(`${req.method}\t${req.headers.origin}\t${req.url}`)
  console.log(`${req.method} ${req.path}`)
  next()
}

module.exports = logging
