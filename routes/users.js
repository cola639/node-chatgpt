const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const { User, validate } = require('../models/user')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', auth, userController.getUser)

module.exports = router
