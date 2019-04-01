/* eslint-disable no-console */
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
    name: 'new-repo',
    repo_name: 'new-repo-node',
    description: 'a new repo yo',
  },
  local: {
    rootPath: '../', // relative to where you are running the process or absolute
  },
  authentication: {
    github_token: process.env.GITHUB_TOKEN,
    travis_token: process.env.TRAVIS_TOKEN,
    npm_token: process.env.NPM_TOKEN,
  },
  /*
  proxy: {
    host: 'http.proxy.fmr.com',
    port: 8000,
  },
  */
}

const fs = setupFs(config)
const git = setupGit(config)
const gh = setupGithub(config)
const travis = setupTravis(config)

const clean = async () => {
  await gh.repos.delete(config.project.repo_name)
  await fs.clean()
}

const setup = async () => {
  await gh.repos.create(config.project.repo_name, config.project.description)
  await fs.init()
  await git.initialSetup()
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

const ghCreate = async args => gh.repos.create(args.repo, args.description)

const travisList = async () => {
  const list = await travis.list()
  console.log('repos:', list.map(item => item.name))
}

const travisInfo = async () => {
  const info = await travis.info()
  console.log('repo:', info)
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

  .command('travis-list', '', () => {}, travisList)
  .command('travis-validate', '', () => {}, travisValidate)
  .command('travis-info', '', () => {}, travisInfo)
  .command('travis-activate', '', () => {}, async () => travis.activate())

  .command(['github-repos', 'github-list'], 'list github repos', () => {}, ghRepos)
  .command('github-exists <repo>', '', () => {}, ghExists)
  .command('github-branches <repo>', '', () => {}, ghBranches)
  .command('github-create <repo> <description>', 'Create a github repo', () => {}, ghCreate)

  .command(['clean', 'delete'], 'Clean up all created resources', () => {}, clean)
  .command(['init', 'setup'], 'setup the project', () => {}, setup)
  .demandCommand(1, 1).argv
/* eslint-enable no-unused-expressions */
