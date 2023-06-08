const bcrypt = require('bcryptjs')
const _ = require('lodash')
const { User, validate } = require('../models/mysqlUser')

const getUser = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
}

const newUser = async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // Create a Tutorial
  const user = new User({
    nick_name: req.body.nick_name,
    user_name: req.body.user_name,
    password: req.body.password,
    email: req.body.email
  })

  // Save Tutorial in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Tutorial.'
      })
    else res.send(data)
  })

  // let user = await User.findOne({ email: req.body.email })
  // if (user) return res.status(400).send('User already registered.')

  // let user = new User(_.pick(req.body, ['name', 'email', 'password']))
  // const salt = await bcrypt.genSalt(10)
  // user.password = await bcrypt.hash(user.password, salt)
  // await user.save()

  // const token = user.generateAuthToken()
  // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
}

module.exports = {
  getUser,
  newUser
}
