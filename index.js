const express = require('express')
const serveIndex = require('serve-index')
const path = require('path')
const chokidar = require('chokidar')
const reload = require('reload')
const sassMiddleware = require('node-sass-middleware')

const renderDocument = require('./lib/render-document')
const { OHM_PREFIX } = require('./lib/constants')

const app = express()

app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'pug')

app.use(sassMiddleware({
  src: path.join(__dirname, 'styles'),
  dest: path.join(__dirname, 'public'),
  prefix: OHM_PREFIX
}))
app.use(OHM_PREFIX, express.static(path.join(__dirname, 'public')))
app.use(serveIndex(process.cwd()))

app.get(/\.md$/, renderDocument)

const reloadServer = reload(app)

chokidar.watch(process.cwd()).on('all', () => {
  reloadServer.reload()
})

app.listen(3000)
