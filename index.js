const fs = require('fs')

module.exports = {
  getPathOfLists: () => {
    return fs.realpathSync(`.`)
  }
}
