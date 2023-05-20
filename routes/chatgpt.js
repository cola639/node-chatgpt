const express = require('express')
const router = express.Router()
const chatGptController = require('../controllers/chatGptController')

router.get('/', chatGptController.askChatGpt)
router.post('/gptTuro', chatGptController.gptTuro)
router.post('/imageGenerate', chatGptController.generateImage)

module.exports = router
