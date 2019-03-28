const ghGot = require('gh-got')
const tunnel = require('tunnel')
const parseLinkHeader = require('parse-link-header')

module.exports = config => {
  let agent = null

  if (config.proxy)
    agent = tunnel.httpsOverHttp({
      proxy: {
        host: config.proxy.host,
        port: config.proxy.port,
      },
    })

  const callGh = async (url, options = {}) =>
    ghGot(url, {
      token: config.authentication.github_token,
      agent,
      ...options,
    })

  const listAll = async (url, bodies = []) => {
    const urlToCall = typeof url === 'string' ? url : url.next.url

    const response = await callGh(urlToCall)
    Array.prototype.push.apply(bodies, response.body)
    const nextLinks = parseLinkHeader(response.headers.link)
    if (nextLinks && nextLinks.next) await listAll(nextLinks, bodies)

    return bodies
  }

  const gh = {
    repos: {},
    repo: {},
  }

  gh.repos.create = async (name, description) =>
    callGh(`user/repos`, { method: 'POST', body: { name, description } })
  gh.repos.delete = async name =>
    callGh(`repos/${config.author.github_username}/${name}`, { method: 'DELETE' })
  gh.repos.list = async () => listAll('user/repos')

  gh.repo.info = async name => callGh(`/repos/${config.author.github_username}/${name}`)
  gh.repo.branches = async name =>
    listAll(`/repos/${config.author.github_username}/${name}/branches`)
  gh.repo.exists = async name => {
    try {
      await callGh(`/repos/${config.author.github_username}/${name}`, { method: 'HEAD' })
    } catch (e) {
      if (e.response.statusCode === 404) return false
      throw e
    }
    return true
  }

  return gh
}
