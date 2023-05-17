const express = require('express')
const router = express.Router()
const mdController = require('../controllers/mdController')

router.get('/', mdController.getMDFile)

module.exports = router
