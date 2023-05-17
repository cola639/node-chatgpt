// module.exports = function (err, req, res, next) {
//   logger.error(err.message, err)

//   // error
//   // warn
//   // info
//   // verbose
//   // debug
//   // silly

//   res.status(404).send('404 Not Found')
// }

const notFound = (req, res) => {
  res.status(404).send('404 Not Found')
}

module.exports = notFound
