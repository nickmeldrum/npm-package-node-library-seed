const path = require('path')
const fsExtra = require('fs-extra')

module.exports = config => {
  const workingDir = path.join(config.git.rootPath, config.project.name)

  const fs = {}

  fs.init = async () => {
    await fsExtra.ensureDir(workingDir)
    await fsExtra.copy('./template', workingDir)
  }

  fs.clean = async () => {
    await fsExtra.remove(workingDir)
  }

  return fs
}
