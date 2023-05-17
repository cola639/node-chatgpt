const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const corsOptions = require('../config/options/cors')
const staticOptions = require('../config/options/static')
const logging = require('./logging')

const chatGPT = require('../routes/chatgpt')
const notFound = require('../middleware/notFound')

module.exports = function (app) {
  app.use(logging) // logging http
  app.use(cors(corsOptions)) // CORS
  app.use(express.urlencoded({ extended: false })) // content-type formdata
  app.use(express.json()) // content-type json
  app.use(cookieParser()) // cookie add to req obj
  app.use('/static', express.static('static', staticOptions)) // config accessible static
  app.use('/api/chatGpt', chatGPT) // config accessible static
  app.all('*', notFound) // not found handle
}
