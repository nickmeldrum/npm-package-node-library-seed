const path = require('path')
const util = require('util')
const fsExtra = require('fs-extra')
const handlebars = require('handlebars')

const readdir = util.promisify(fsExtra.readdir)

const templateDirectory = './template'
const templateSuffix = '.template'
const encoding = 'utf8'

const fs = {}

const renderTemplate = templateData => async file => {
  const contents = await fsExtra.readFile(file, encoding)
  const fileToWrite = file.endsWith(templateSuffix)
    ? file.substring(0, file.length - templateSuffix.length)
    : file
  await fsExtra.remove(file)
  await fsExtra.writeFile(fileToWrite, handlebars.compile(contents)(templateData), encoding)
}

const renderTemplates = async (workingDir, templateData) => {
  const renderTemplateWithData = renderTemplate(templateData)
  const isDirectory = source => fsExtra.lstatSync(path.join(workingDir, source)).isDirectory()
  const dirContents = await readdir(workingDir)
  const dirs = dirContents.filter(isDirectory)
  const files = dirContents.filter(item => !isDirectory(item))
  await Promise.all(dirs.map(subDir => renderTemplates(path.join(workingDir, subDir))))
  await Promise.all(files.map(file => renderTemplateWithData(path.join(workingDir, file))))
}

fs.init = async (workingDir, templateData) => {
  await fsExtra.ensureDir(workingDir)
  await fsExtra.copy(templateDirectory, workingDir)
  await renderTemplates(workingDir, templateData)
}

fs.clean = async workingDir => fsExtra.remove(workingDir)

module.exports = fs
