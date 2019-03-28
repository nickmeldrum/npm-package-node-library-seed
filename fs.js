const path = require('path')
const fsExtra = require('fs-extra')
const mustache = require('mustache')

module.exports = config => {
  const workingDir = path.join(config.local.rootPath, config.project.repo_name)

  const fs = {}

  const renderTemplates = async () => {
    const file = path.join(workingDir, 'package.json')
    const contents = await fsExtra.readFile(file, 'utf8')
    await fsExtra.writeFile(file, mustache.render(contents, config), 'utf8')
  }

  fs.init = async () => {
    await fsExtra.ensureDir(workingDir)
    await fsExtra.copy('./template', workingDir)
    await renderTemplates()
  }

  fs.clean = async () => {
    await fsExtra.remove(workingDir)
  }

  return fs
}
