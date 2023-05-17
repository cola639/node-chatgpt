const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const { User, validate } = require('../models/user')
const express = require('express')
const router = express.Router()

const getUser = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
}

module.exports = {
  getUser
}
