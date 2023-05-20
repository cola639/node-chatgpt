const config = require('config')
const { Configuration, OpenAIApi } = require('openai')
const { PassThrough } = require('stream')

require('isomorphic-fetch') // 支持fetch

// 初始化OpenAI连接
const CLOSE_MARK_MSG = 'END标记'
let openai, chatgptApi
const apiKey = config.get('openAIKey')
const connectOpenAI = async () => {
  const configuration = new Configuration({
    apiKey
  })

  openai = new OpenAIApi(configuration)
  const { ChatGPTAPI } = await import('chatgpt')
  chatgptApi = new ChatGPTAPI({ apiKey })
}
connectOpenAI()

const askChatGpt = async (req, res) => {
  console.log('askChatGpt worked')
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  })
  const streamData = new PassThrough()
  streamData.pipe(res)

  const { chatContent } = req.query
  console.log('🚀 >> askChatGpt >> chatContent:', chatContent)
  console.log('🚀>> askChatGpt >> chatgptApi:', chatgptApi)
  chatgptApi.sendMessage(chatContent, {
    onProgress: (partRes) => {
      console.log(JSON.stringify(partRes))
      streamData.write(`data:${JSON.stringify(partRes.text)}\n\n`)
      if (partRes.detail.choices[0].finish_reason === 'stop') {
        console.log('响应已结束', partRes.text)
        streamData.write(`data:${CLOSE_MARK_MSG}\n\n`)
        streamData.end()
      }
    }
  })
}

const generateImage = async (req, res) => {
  let { prompt, imgCount, imgSize, responseFormat } = req.body
  console.log('imageGenerate', prompt)

  try {
    const res = await openai.createImage({
      prompt,
      n: imgCount || 1,
      size: imgSize || '1024x1024',
      response_format: responseFormat || 'url'
    })
    console.log('img generate result', res.data)
    console.log('responseFormat', responseFormat)
    res.json({
      code: 200,
      msg: '成功',
      data: res.data.data
    })
  } catch (e) {
    console.log('error', e)
    res.status(404).send({ code: 404, msg: error.details[0].message })
  }
}

const reqData = {
  messages: [
    {
      role: 'system',
      content:
        'You are a helpful assistant. You can help me by answering my questions. You can also ask me questions.'
    },
    { role: 'user', content: '你好' },
    { role: 'user', content: '美国程序员薪资水平' }
  ],
  model: 'gpt-3.5-turbo',
  max_tokens: 2048,
  temperature: 0.7,
  stream: true
}

const gptTuro = async (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  })
  const streamData = new PassThrough()
  streamData.pipe(res)

  try {
    const host = 'https://api.openai.com'

    const config = {
      host,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqData)
    }

    const response = await fetch(`${host}/v1/chat/completions`, config)
    await handleSSE(response, (message) => {
      if (message === '[DONE]') {
        streamData.write(`响应已结束`)
        streamData.end()
        return
      }

      const data = JSON.parse(message)
      if (data.error) throw new Error(`Error from OpenAI: ${JSON.stringify(data)}`)

      const text = data.choices[0]?.delta?.content
      if (text !== undefined) {
        console.log('🚀🚀 >> text:', text)
        streamData.write(`text:${JSON.stringify(text)}`)
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error')
  }
}

async function handleSSE(response, onMessage) {
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error ? JSON.stringify(error) : `${response.status} ${response.statusText}`)
  }
  if (response.status !== 200)
    throw new Error(`Error from OpenAI: ${response.status} ${response.statusText}`)

  if (!response.body) throw new Error('No response body')

  const { createParser } = await import('eventsource-parser')

  const parser = createParser((event) => {
    if (event.type === 'event') {
      onMessage(event.data)
    }
  })

  for await (const chunk of iterableStreamAsync(response.body)) {
    const str = new TextDecoder().decode(chunk)
    parser.feed(str)
  }
}

async function* iterableStreamAsync(stream) {
  const reader = stream.getReader()
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) return
      else yield value
    }
  } finally {
    reader.releaseLock()
  }
}

module.exports = {
  askChatGpt,
  generateImage,
  gptTuro
}
