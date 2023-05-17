const config = require('config')
const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: config.get('openAIKey')
})
const openai = new OpenAIApi(configuration)

console.log('🚀 >> openAIKey', config.get('openAIKey'))

const askChatGpt = async (req, res) => {
  try {
    // const { prompt } = req.body
    const prompt = `
    write me a joke about a cat and a bowl of pasta. Return response in the following parsable JSON format:

    {
        "Q": "question",
        "A": "answer"
    }

`

    // const response = await openai.createCompletion({
    //   model: 'text-davinci-003',
    //   prompt,
    //   max_tokens: 64,
    //   temperature: 0,
    //   top_p: 1.0,
    //   frequency_penalty: 0.0,
    //   presence_penalty: 0.0,
    //   stop: ['\n']
    // })
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 2048,
      temperature: 1
    })

    const parsableJSONresponse = response.data.choices[0].text
    const parsedResponse = JSON.parse(parsableJSONresponse)

    console.log('Question: ', parsedResponse.Q)
    console.log('Answer: ', parsedResponse.A)

    // return res.status(200).json({
    //   success: true,
    //   data: response.data.choices[0].text
    // })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response ? error.response.data : 'There was an issue on the server'
    })
  }
}

module.exports = {
  askChatGpt
}
