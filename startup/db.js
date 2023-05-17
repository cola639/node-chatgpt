const logger = require('../utils/logger')
const mongoose = require('mongoose')
const config = require('config')

module.exports = function () {
  const db = config.get('db')
  mongoose.connect(db).then(() => {
    logger.log({
      level: 'info',
      message: `Connected to ${db}...`
    })

    console.log('🚀 Connected to MongoDB sucess')
  })
}
