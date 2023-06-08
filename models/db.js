const mysql = require('mysql')
const config = require('config')

const connection = mysql.createPool({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DB
})

module.exports = connection
