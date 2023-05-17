require('winston-mongodb')
require('express-async-errors')
const dayjs = require('dayjs')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf } = format

// const colors = {
//   error: 'red',
//   warn: 'blue',
//   info: 'blue',
//   http: 'white',
//   verbose: 'green',
//   debug: 'green',
//   silly: 'green'
// }

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6
// }

// addColors(colors)

const timezone = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
}
const myFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`
})

const logger = createLogger({
  format: combine(timestamp({ format: timezone }), myFormat),
  transports: [
    new transports.Console({ colorize: true, prettyPrint: false }),
    new transports.File({
      filename: `./logs/${dayjs().format('YYYY-MM-DD')}_info.log`,
      level: 'info'
    }),
    new transports.File({
      filename: `./logs/${dayjs().format('YYYY-MM-DD')}_reqLog.log`,
      level: 'http'
    }),
    new transports.File({
      filename: `./logs/${dayjs().format('YYYY-MM-DD')}_warn.log`,
      level: 'warn'
    }),
    new transports.MongoDB({
      db: 'mongodb://localhost:27017/vidly',
      level: 'info',
      collection: 'logs',
      storeHost: true
    })
  ],

  exceptionHandlers: [
    new transports.Console({ colorize: true, prettyPrint: true }),
    new transports.File({
      filename: `./logs/${dayjs().format('YYYY-MM-DD')}_exception.log`,
      level: 'error'
    }),
    new transports.MongoDB({
      db: 'mongodb://localhost:27017/vidly',
      level: 'error',
      collection: 'error',
      storeHost: true
    })
  ]
})

process.on('unhandledRejection', (ex) => {
  throw ex
})

module.exports = logger
