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
        authorization: `token ${config.travis.token}`,
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
    listAll(`/owner/${config.travis.author}/repos?limit=100`, 'repositories')

  travis.info = async () => callTravis(`/repo/${config.travis.author}%2F${config.project.name}`)

  travis.activate = async () =>
    callTravis(`/repo/${config.travis.author}%2F${config.project.name}/activate`, {
      method: 'POST',
    })

  travis.configValid = async () => {
    const configPath = path.join(config.git.rootPath, config.project.name, '.travis.yml')
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
