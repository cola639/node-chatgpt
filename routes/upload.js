const fileUpload = require('express-fileupload')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const filesPayloadExists = require('../middleware/files/filesPayloadExists')
const fileExtLimiter = require('../middleware/files/fileExtLimiter')
const fileSizeLimiter = require('../middleware/files/fileSizeLimiter')
const uploadController = require('../controllers/uploadController')

router.post(
  '/',
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter(['.png', '.jpg', '.jpeg']),
  fileSizeLimiter,
  uploadController.saveFile
)

module.exports = router
