/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const util = require('util')
const pause = require('./pause')
const api = require('./api')

let token
let proxy

module.exports.setup = ({ authToken, proxySettings }) => {
  token = authToken
  proxy = proxySettings
}

const callTravis = api({
  baseUrl: 'https://api.travis-ci.org',
  headers: {
    'Travis-API-Version': '3',
  },
  token,
  proxy,
})

const readFile = util.promisify(fs.readFile)

const listAll = async (url, listName, list = []) => {
  const response = await callTravis(url)
  Array.prototype.push.apply(list, response.body[listName])
  const pagination = response.body['@pagination']
  if (!pagination.is_last) await listAll(pagination.next['@href'], listName, list)
  return list
}

const travis = {}

travis.userInfo = async () => callTravis(`/user`)

travis.setUserId = async () => {
  travis.userId = (await travis.userInfo()).body.id
}

travis.list = async user => listAll(`/owner/${user}/repos?limit=100`, 'repositories')

travis.info = async (user, repository) => callTravis(`/repo/${user}%2F${repository}`)

travis.isSyncing = async () => (await travis.userInfo()).body.is_syncing

travis.syncRepos = async () => {
  if (!travis.userId) await travis.setUserId()
  if (await travis.isSyncing()) return
  await callTravis(`/user/${travis.userId}/sync`, { method: 'POST' })
}

travis.activate = async (user, repository) =>
  callTravis(`/repo/${user}%2F${repository}/activate`, {
    method: 'POST',
  })

travis.trySyncAndActivate = async () => {
  const retries = 5
  const delayBetweenRetries = 5000

  let currentRetry = 0
  let done = false

  /* eslint-disable no-await-in-loop */
  while (currentRetry < retries && done === false) {
    console.log('travis syncing...')
    await travis.syncRepos()
    try {
      currentRetry += 1
      console.log(
        'trying to activate...',
        `(retry: ${currentRetry}, maxRetries: ${retries}, delayBetweenRetries: ${delayBetweenRetries})`,
      )
      await travis.activate()
      done = true
    } catch (e) {
      if (e.statusCode === 404) await pause(delayBetweenRetries)
      else throw e
    }
  }

  try {
    const repo = (await travis.info()).body
    console.log('travis repo ', repo.active ? 'activated' : 'not activated')
  } catch (e) {
    if (e.statusCode === 404)
      console.log(`travis repo not found, activation failed after ${retries} retries...`)
    else throw e
  }
  /* eslint-enable no-await-in-loop */
}

travis.configValid = async (rootPath, repository) => {
  const configPath = path.join(rootPath, repository, '.travis.yml')
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

module.exports = travis
