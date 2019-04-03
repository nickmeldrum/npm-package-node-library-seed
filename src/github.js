const parseLinkHeader = require('parse-link-header')
const api = require('./api')

let token
let proxy

module.exports.setup = ({ authToken, proxySettings }) => {
  token = authToken
  proxy = proxySettings
}

const callGh = api({
  baseUrl: 'https://api.github.com',
  headers: {
    accept: 'application/vnd.github.v3+json',
  },
  token,
  proxy,
})

const listAll = async (url, bodies = []) => {
  const urlToCall = typeof url === 'string' ? url : url.next.url

  const response = await callGh(urlToCall)
  Array.prototype.push.apply(bodies, response.body)
  const nextLinks = parseLinkHeader(response.headers.link)
  if (nextLinks && nextLinks.next) await listAll(nextLinks, bodies)

  return bodies
}

module.exports.repos = {}
module.exports.repo = {}

module.exports.repos.create = async (user, name, description) =>
  callGh('/user/repos', { method: 'POST', body: { name, description } })
module.exports.repos.delete = async (user, name) =>
  callGh(`/repos/${user}/${name}`, { method: 'DELETE' })
module.exports.repos.list = async () => listAll('/user/repos')

module.exports.repo.info = async (user, name) => callGh(`/repos/${user}/${name}`)
module.exports.repo.branches = async (user, name) => listAll(`/repos/${user}/${name}/branches`)
module.exports.repo.exists = async (user, name) => {
  try {
    await callGh(`/repos/${user}/${name}`, { method: 'HEAD' })
  } catch (e) {
    if (e.response.statusCode === 404) return false
    throw e
  }
  return true
}
