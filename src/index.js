/* eslint-disable no-console */
const config = require('./config')
const fs = require('./fs')
const git = require('./git')
const github = require('./github')
const travis = require('./travis')

const clean = async () => {
  console.log('removing the github repo...')
  await github.repos.delete(config.project.repo_name)
  console.log('cleaning the filesystem...')
  await fs.clean()
  console.log('syncing travis...')
  await travis.syncRepos()
}

const setup = async () => {
  console.log('creating github repo...')
  await github.repos.create(config.project.repo_name, config.project.description)
  console.log('building local files from template...')
  await fs.init()
  console.log('setting up git repo and tracking remote...')
  await git.initialSetup()
  console.log('syncing and activating travis...')
  await travis.trySyncAndActivate()
}

const ghRepos = async () => {
  const list = await github.repos.list()
  console.log('repos:', list.map(item => item.name))
}

const ghBranches = async args => {
  const list = await github.repo.branches(args.repo)
  console.log('branches:', list.map(item => item.name))
}

const ghExists = async args => {
  const repoExists = await github.repo.exists(args.repo)
  console.log(args.repo, repoExists ? 'exists' : "doesn't exist")
}

const ghDelete = async args => github.repos.delete(args.repo)

const ghCreate = async args => github.repos.create(args.repo, args.description)

const travisList = async () => {
  const list = await travis.list()
  console.log('repos:', list.map(item => item.name))
}

const travisInfo = async () => {
  const info = await travis.info()
  console.log('repo:', info)
}

const travisUserInfo = async () => {
  const info = await travis.userInfo()
  console.log('user:', info)
}

const travisValidate = async () => {
  const valid = await travis.configValid()
  console.log('the travis config is', valid ? 'valid' : 'not valid')
}

/* eslint-disable no-unused-expressions */
require('yargs')
  .command('fs-init', '', () => {}, async () => fs.init())
  .command('fs-clean', '', () => {}, async () => fs.clean())

  .command('git-initialSetup', '', () => {}, async () => git.initialSetup())

  .command('travis-userinfo', '', () => {}, travisUserInfo)
  .command('travis-sync', '', () => {}, async () => travis.syncRepos())
  .command('travis-list', '', () => {}, travisList)
  .command('travis-validate', '', () => {}, travisValidate)
  .command('travis-info', '', () => {}, travisInfo)
  .command('travis-activate', '', () => {}, async () => travis.activate())

  .command(['github-repos', 'github-list'], 'list github repos', () => {}, ghRepos)
  .command('github-exists <repo>', '', () => {}, ghExists)
  .command('github-delete <repo>', '', () => {}, ghDelete)
  .command('github-branches <repo>', '', () => {}, ghBranches)
  .command('github-create <repo> <description>', 'Create a github repo', () => {}, ghCreate)

  .command(['clean', 'delete'], 'Clean up all created resources', () => {}, clean)
  .command(['init', 'setup'], 'setup the project', () => {}, setup)
  .demandCommand(1, 1).argv
/* eslint-enable no-unused-expressions */
