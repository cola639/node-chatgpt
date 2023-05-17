const config = require('config')

module.exports = function () {
  // check some setting
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.')
  }
}
