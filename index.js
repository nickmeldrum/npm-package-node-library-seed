/* eslint-disable no-console */
const setupChecks = require('./checks')
const setupFs = require('./fs')
const setupGit = require('./git')
const setupGithub = require('./github')
const setupTravis = require('./travis')

const config = {
  author: {
    name: 'Nick Meldrum',
    email: 'nick@nickmeldrum.com',
    website: 'https://nickmeldrum.com',
    github_username: 'nickmeldrum',
    npm_email: 'npm@nickmeldrum.com',
  },
  project: {
    name: 'new-repo-4',
    repo_name: 'new-repo-node-4',
    description: 'a new repo yo',
    keywords: ['new', 'repo'],
  },
  local: {
    rootPath: '../', // relative to where you are running the process or absolute
  },
  authentication: {
    github_token: process.env.GITHUB_TOKEN,
    travis_token: process.env.TRAVIS_TOKEN,
    npm_token: process.env.NPM_TOKEN,
  },
  proxy: {
    host: 'http.proxy.fmr.com',
    port: 8000,
  },
}

const checks = setupChecks(config)
const fs = setupFs(config)
const git = setupGit(config)
const gh = setupGithub(config)
const travis = setupTravis(config)

const clean = async () => {
  console.log('removing the github repo...')
  await gh.repos.delete(config.project.repo_name)
  console.log('cleaning the filesystem...')
  await fs.clean()
  console.log('syncing travis...')
  await travis.syncRepos()
}

const setup = async () => {
  console.log('validating config...')
  checks.validateConfig()
  console.log('creating github repo...')
  await gh.repos.create(config.project.repo_name, config.project.description)
  console.log('building local files from template...')
  await fs.init()
  console.log('setting up git repo and tracking remote...')
  await git.initialSetup()
  console.log('syncing and activating travis...')
  await travis.trySyncAndActivate()
}

const ghRepos = async () => {
  const list = await gh.repos.list()
  console.log('repos:', list.map(item => item.name))
}

const ghBranches = async args => {
  const list = await gh.repo.branches(args.repo)
  console.log('branches:', list.map(item => item.name))
}

const ghExists = async args => {
  const repoExists = await gh.repo.exists(args.repo)
  console.log(args.repo, repoExists ? 'exists' : "doesn't exist")
}

const ghDelete = async args => gh.repos.delete(args.repo)

const ghCreate = async args => gh.repos.create(args.repo, args.description)

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
  .command('validate', '', () => {}, async () => checks.validateConfig())

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
