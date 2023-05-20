const config = require('config')
const express = require('express')
const app = express()
// const logger = require('./utils/logger')

require('./routes')(app) // 路由配置
// require('./startup/db')() // 启动数据库
require('./startup/config')() // 检查配置
require('./startup/validation')()

const port = config.get('port') || 3000

const server = app.listen(port, () => console.log(`Listening on port ${port}...`))

module.exports = server
