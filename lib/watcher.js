const chokidar = require('chokidar')
const reload = require('reload')

const app = require('./server')
const logger = require('./logger')

const reloadServer = reload(app)

logger.watch(`folder ${process.cwd()}`)
chokidar.watch(process.cwd()).on('all', (event, file) => {
  if (event === 'change') {
    logger.changed(`${file} changed. Reloading...`)
  }
  reloadServer.reload()
})
