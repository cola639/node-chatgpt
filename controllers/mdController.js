const fs = require('fs')
// const marked = require('marked')
const { marked } = require('marked')

const getMDFile = async (req, res) => {
  const content = fs.readFileSync('static/README.md', 'utf-8')

  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
      const hljs = require('highlight.js')
      const language = hljs.getLanguage(lang) ? lang : 'javascript' // default
      return hljs.highlight(code, { language }).value
    },
    langPrefix: 'hljs language-javascript', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartypants: false,
    xhtml: false
  })

  // Compile
  // console.log(marked.parse(content))

  res.send({
    status: 200,
    md: marked.parse(content)
  })
}

module.exports = {
  getMDFile
}
