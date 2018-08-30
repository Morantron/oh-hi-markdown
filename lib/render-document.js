const pathFromUrl = require('./path-from-url')
const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)
const MarkdownIt = require('markdown-it')

const md = new MarkdownIt({
	linkify: false,
	html: true
})

md.use(require('markdown-it-checkbox'))

const renderDocument = async (req, res) => {
  const documentPath = pathFromUrl(req.url)
  const rawDocument = await readFile(documentPath)

  res.set('Content-Type', 'text/html; charset=utf-8')

  res.render(
    'document',
    {
      title: documentPath,
      markdown_contents: md.render(rawDocument.toString())
    }
  )
}

module.exports = renderDocument
