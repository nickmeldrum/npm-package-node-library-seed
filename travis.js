const got = require('got')
const tunnel = require('tunnel')

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

  const callTravis = async (relativeUrl, options = {}) =>
    got(makeUrl(relativeUrl), {
      agent,
      json: true,
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

  return travis
}
