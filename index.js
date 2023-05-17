const config = require('config')
const express = require('express')
const app = express()
const logger = require('./utils/logger')

require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')() // 引入自启动函数
require('./startup/validation')()

const port = config.get('port') || 3000

const server = app.listen(port, () => logger.info(`Listening on port ${port}...`))

module.exports = server
