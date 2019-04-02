const path = require('path')
const util = require('util')
const fsExtra = require('fs-extra')
const handlebars = require('handlebars')
const config = require('./config')

const readdir = util.promisify(fsExtra.readdir)

const templateSuffix = '.template'

const workingDir = path.join(config.local.rootPath, config.project.repo_name)

const fs = {}

const renderTemplate = async file => {
  const contents = await fsExtra.readFile(file, 'utf8')
  const fileToWrite = file.endsWith(templateSuffix)
    ? file.substring(0, file.length - templateSuffix.length)
    : file
  await fsExtra.remove(file)
  await fsExtra.writeFile(fileToWrite, handlebars.compile(contents)(config), 'utf8')
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

module.exports = fs
