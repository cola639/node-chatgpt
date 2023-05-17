const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const captchaController = require('../controllers/captchaController')

router.get('/', captchaController.getCaptch)

module.exports = router
