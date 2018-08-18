const express = require('express')
const serveIndex = require('serve-index')
const path = require('path')
const chokidar = require('chokidar')
const reload = require('reload')

const renderDocument = require('./lib/render-document')

const app = express()

app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'pug')
app.use(serveIndex(process.cwd()))
app.get(/\.md$/, renderDocument)

const reloadServer = reload(app)

chokidar.watch(process.cwd()).on('all', () => {
  reloadServer.reload()
})

app.listen(3000)
