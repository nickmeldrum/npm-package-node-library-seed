const config = require('./config')
const github = require('./github')
const travis = require('./travis')
const fs = require('./fs')
const git = require('./git')

module.exports.gitInitialSetup = async () =>
  git.initialSetup({
    workingDir: config.workingDir,
    githubUser: config.author.github_username,
    repositoryName: config.project.repo_name,
  })

module.exports.fsClean = async () => fs.clean(config.workingDir)
module.exports.fsInit = async () => fs.init(config.workingDir, config)

module.exports.ghSetup = () =>
  github.setup({
    authToken: config.authentication.github_token,
    proxySettings: config.proxy,
  })
module.exports.ghDelete = async () =>
  github.repos.delete(config.author.github_username, config.project.repo_name)
module.exports.ghCreate = async () =>
  github.repos.create(
    config.author.github_username,
    config.project.repo_name,
    config.project.description,
  )

module.exports.travisSync = async () => travis.syncRepos()
module.exports.travisSyncAndActivate = async () => travis.trySyncAndActivate()
