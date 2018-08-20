const { Signale } = require('signale')

const logger = new Signale({
  scope: 'oh-hi-markdown',
  types: {
    changed: {
      color: 'blue',
      label: 'changed'
    }
  }
})

logger.config({ displayBadge: false })

module.exports = logger
