const path = require('path')
const util = require('util')
const fsExtra = require('fs-extra')
const handlebars = require('handlebars')
const config = require('./config')

const readdir = util.promisify(fsExtra.readdir)

const templateSuffix = '.template'

const fs = {}

const renderTemplate = async file => {
  const contents = await fsExtra.readFile(file, 'utf8')
  const fileToWrite = file.endsWith(templateSuffix)
    ? file.substring(0, file.length - templateSuffix.length)
    : file
  await fsExtra.remove(file)
  await fsExtra.writeFile(fileToWrite, handlebars.compile(contents)(config), 'utf8')
}

const renderTemplates = async () => {
  const isDirectory = source =>
    fsExtra.lstatSync(path.join(config.workingDir, source)).isDirectory()
  const dirContents = await readdir(config.workingDir)
  const dirs = dirContents.filter(isDirectory)
  const files = dirContents.filter(item => !isDirectory(item))
  await Promise.all(dirs.map(subDir => renderTemplates(path.join(config.workingDir, subDir))))
  await Promise.all(files.map(file => renderTemplate(path.join(config.workingDir, file))))
}

fs.init = async () => {
  await fsExtra.ensureDir(config.workingDir)
  await fsExtra.copy('./template', config.workingDir)
  await renderTemplates()
}

fs.clean = async () => {
  await fsExtra.remove(config.workingDir)
}

module.exports = fs
