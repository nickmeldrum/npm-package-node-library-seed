const fs = require('fs')
const path = require('path')
const util = require('util')
const got = require('got')
const tunnel = require('tunnel')

const readFile = util.promisify(fs.readFile)

const baseUrl = 'https://api.travis-ci.org'
const makeUrl = relative => `${baseUrl}${relative}`

module.exports = config => {
  let agent = null

  if (config.proxy)
    agent = tunnel.httpsOverHttp({
      proxy: {
        host: config.proxy.host,
        port: config.proxy.port,
      },
    })

  const callTravis = async (relativeUrl, options = {}, json = true) =>
    got(makeUrl(relativeUrl), {
      agent,
      json,
      headers: {
        authorization: `token ${config.authentication.travis_token}`,
        'Travis-API-Version': '3',
      },
      ...options,
    })

  const listAll = async (url, listName, list = []) => {
    const response = await callTravis(url)
    Array.prototype.push.apply(list, response.body[listName])
    const pagination = response.body['@pagination']
    if (!pagination.is_last) await listAll(pagination.next['@href'], listName, list)
    return list
  }

  const travis = {}

  travis.list = async () =>
    listAll(`/owner/${config.author.github_username}/repos?limit=100`, 'repositories')

  travis.info = async () =>
    callTravis(`/repo/${config.author.github_username}%2F${config.project.repo_name}`)

  travis.activate = async () =>
    callTravis(`/repo/${config.author.github_username}%2F${config.project.repo_name}/activate`, {
      method: 'POST',
    })

  travis.configValid = async () => {
    const configPath = path.join(config.local.rootPath, config.project.repo_name, '.travis.yml')
    const body = await readFile(configPath, 'utf8')
    try {
      await callTravis(
        '/lint',
        {
          method: 'POST',
          body,
        },
        false,
      )
    } catch (e) {
      return false
    }

    return true
  }

  return travis
}
