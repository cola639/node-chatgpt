const sql = require('./db')
const Joi = require('joi')

// constructor
const User = function (user) {
  this.nick_name = user.nick_name
  this.user_name = user.user_name
  this.email = user.email
  this.password = user.password
}

User.create = (newUser, result) => {
  sql.query('INSERT INTO sys_user SET ?', newUser, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(err, null)
      return
    }

    console.log('created User: ', { id: res.insertId, ...newUser })
    result(null, { id: res.insertId, ...newUser })
  })
}

User.findById = (id, result) => {
  sql.query(`SELECT * FROM Users WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(err, null)
      return
    }

    if (res.length) {
      console.log('found User: ', res[0])
      result(null, res[0])
      return
    }

    // not found User with the id
    result({ kind: 'not_found' }, null)
  })
}

User.getAll = (title, result) => {
  let query = 'SELECT * FROM Users'

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    console.log('Users: ', res)
    result(null, res)
  })
}

User.getAllPublished = (result) => {
  sql.query('SELECT * FROM Users WHERE published=true', (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    console.log('Users: ', res)
    result(null, res)
  })
}

User.updateById = (id, User, result) => {
  sql.query(
    'UPDATE Users SET title = ?, description = ?, published = ? WHERE id = ?',
    [User.title, User.description, User.published, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err)
        result(null, err)
        return
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: 'not_found' }, null)
        return
      }

      console.log('updated User: ', { id: id, ...User })
      result(null, { id: id, ...User })
    }
  )
}

User.remove = (id, result) => {
  sql.query('DELETE FROM Users WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: 'not_found' }, null)
      return
    }

    console.log('deleted User with id: ', id)
    result(null, res)
  })
}

User.removeAll = (result) => {
  sql.query('DELETE FROM Users', (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    console.log(`deleted ${res.affectedRows} Users`)
    result(null, res)
  })
}

function validateUser(user) {
  const schema = {
    user_name: Joi.string().min(5).max(50).required(),
    nick_name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  }

  return Joi.validate(user, schema)
}

exports.User = User
exports.validate = validateUser
