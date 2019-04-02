const path = require('path')
const urlHelper = require('./url')
const config = require('../config.json')

const checkTokens = () => {
  if (!config.authentication.github_token)
    throw new Error('github token not set (via env var: GITHUB_TOKEN)')
  if (!config.authentication.travis_token)
    throw new Error('travis token not set (via env var: TRAVIS_TOKEN)')
  if (!config.authentication.npm_token)
    throw new Error('npm token not set (via env var: NPM_TOKEN)')
}

const setTokens = () => {
  config.authentication = {}
  config.authentication.github_token = process.env.GITHUB_TOKEN
  config.authentication.travis_token = process.env.TRAVIS_TOKEN
  config.authentication.npm_token = process.env.NPM_TOKEN
}

const setProxy = () => {
  if (process.env.PROXY) {
    const parsedUrl = urlHelper.getUrlAsObject(urlHelper.ensureScheme(process.env.PROXY))
    if (parsedUrl === null) throw new Error(`PROXY var was not a real url: '${process.env.PROXY}'`)
    config.proxy = {}
    config.proxy.host = parsedUrl.host
    config.proxy.port = parsedUrl.port
  }
}

const setWorkingDir = () => {
  config.workingDir = path.join(config.local.rootPath, config.project.repo_name)
}

setTokens()
checkTokens()
setProxy()
setWorkingDir()

module.exports = config
