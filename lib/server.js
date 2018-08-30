const express = require('express')
const serveIndex = require('serve-index')
const path = require('path')
const pug = require('pug')
const sassMiddleware = require('node-sass-middleware')
const { promisify } = require('util')
const openPort = require('openport')
const open = require('open')

openPort.find = promisify(openPort.find)

const logger = require('./logger')
const renderDocument = require('./render-document')
const { OHM_PREFIX } = require('./constants')

const app = express()

const host = 'localhost'

app.set('views', path.join(__dirname, '../templates'))
app.set('view engine', 'pug')

app.use(sassMiddleware({
  src: path.join(__dirname, '../styles'),
  dest: path.join(__dirname, '../public'),
  prefix: OHM_PREFIX,
  debug: Boolean(process.env.DEBUG_SASS)
}))

app.use(OHM_PREFIX, express.static(path.join(__dirname, '../public')))

const indexTemplate = pug.compileFile(path.join(__dirname, '../templates/file-index.pug'))

app.use(serveIndex(process.cwd(), {
  template: (locals, callback) => {
    let error = null
    let htmlString = ''

    try {
      htmlString = indexTemplate({
        ...locals,
        joinPath: path.join.bind(path)
      })
    } catch(e) {
      error = e
    }

    callback(error, htmlString)
  }
}))

app.get(/\.md$/, renderDocument)

async function listenOnAvailablePort() {
  let port = await openPort.find({
    startingPort: 3000,
    endingPort: 9999,
    count: 1
  })

  const url = `http://${host}:${port}`

  logger.success(`server on ${url}`)
  app.listen(port)
  open(url)
}

listenOnAvailablePort()

module.exports = app
