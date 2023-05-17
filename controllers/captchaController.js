const svgCaptcha = require('svg-captcha')

const getCaptch = async (req, res) => {
  const captcha = svgCaptcha.createMathExpr(1, 9)

  res.type('svg')
  res.status(200).send(captcha.data)
}

module.exports = {
  getCaptch
}
