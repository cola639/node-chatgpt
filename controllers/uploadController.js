const path = require('path')

const saveFile = (req, res) => {
  const files = req.files
  console.log(files)

  Object.keys(files).forEach(key => {
    const filepath = path.join(__dirname, '../static', files[key].name)
    console.log('🚀  filepath', filepath)
    files[key].mv(filepath, err => {
      // error
      if (err) return res.status(500).json({ status: 'error', message: err })
    })
  })

  return res.json({
    status: 'success',
    message: Object.keys(files).toString()
  })
}

module.exports = {
  saveFile
}
