const path = require('path')

const pathFromUrl = (url) => {
  return path.join(process.cwd(), url)
}

module.exports = pathFromUrl
