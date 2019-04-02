/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const util = require('util')
const pause = require('./pause')
const config = require('./config')
const api = require('./api')

const callTravis = api({
  baseUrl: 'https://api.travis-ci.org',
  headers: {
    'Travis-API-Version': '3',
  },
  token: config.authentication.travis_token,
  proxy: config.proxy,
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

travis.list = async () =>
  listAll(`/owner/${config.author.github_username}/repos?limit=100`, 'repositories')

travis.info = async () =>
  callTravis(`/repo/${config.author.github_username}%2F${config.project.repo_name}`)

travis.isSyncing = async () => (await travis.userInfo()).body.is_syncing

travis.syncRepos = async () => {
  if (!travis.userId) await travis.setUserId()
  if (await travis.isSyncing()) return
  await callTravis(`/user/${travis.userId}/sync`, { method: 'POST' })
}

travis.activate = async () =>
  callTravis(`/repo/${config.author.github_username}%2F${config.project.repo_name}/activate`, {
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

module.exports = travis
