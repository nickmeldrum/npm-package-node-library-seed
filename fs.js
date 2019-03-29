const path = require('path')
const util = require('util')
const fsExtra = require('fs-extra')
const mustache = require('mustache')

const readdir = util.promisify(fsExtra.readdir)

module.exports = config => {
  const workingDir = path.join(config.local.rootPath, config.project.repo_name)

  const fs = {}

  const renderTemplate = async file => {
    const contents = await fsExtra.readFile(file, 'utf8')
    await fsExtra.writeFile(file, mustache.render(contents, config), 'utf8')
  }

  const renderTemplates = async (dir = workingDir) => {
    const isDirectory = source => fsExtra.lstatSync(path.join(dir, source)).isDirectory()
    const dirContents = await readdir(dir)
    const dirs = dirContents.filter(isDirectory)
    const files = dirContents.filter(item => !isDirectory(item))
    await Promise.all(dirs.map(subDir => renderTemplates(path.join(dir, subDir))))
    await Promise.all(files.map(file => renderTemplate(path.join(dir, file))))
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
