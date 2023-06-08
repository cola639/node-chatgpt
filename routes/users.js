const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', auth, userController.getUser)
router.post('/register', userController.newUser)

module.exports = router
