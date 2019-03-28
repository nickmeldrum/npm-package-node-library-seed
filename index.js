/* eslint-disable no-console */
const setupFs = require('./fs')
const setupGit = require('./git')
const setupGithub = require('./github')
const setupTravis = require('./travis')

const config = {
  project: {
    name: 'new-repo',
    description: 'a new repo yo',
  },
  git: {
    rootPath: '../', // relative to where you are running the process or absolute
  },
  github: {
    author: 'nickmeldrum',
    token: process.env.GITHUB_TOKEN,
  },
  travis: {
    author: 'nickmeldrum',
    token: process.env.TRAVIS_TOKEN,
  },
  proxy: {
    host: 'http.proxy.fmr.com',
    port: 8000,
  },
}

const fs = setupFs(config)
const git = setupGit(config)
const gh = setupGithub(config)
const travis = setupTravis(config)

const clean = async () => {
  await gh.repos.delete(config.project.name)
  await fs.clean()
}

const setup = async () => {
  await gh.repos.create(config.project.name, config.project.description)
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

/* eslint-disable no-unused-expressions */
require('yargs')
  .command('fs-init', '', () => {}, async () => fs.init())
  .command('fs-clean', '', () => {}, async () => fs.clean())

  .command('git-initialSetup', '', () => {}, async () => git.initialSetup())

  .command('travis-list', '', () => {}, travisList)

  .command(['github-repos', 'github-list'], 'list github repos', () => {}, ghRepos)
  .command('github-exists <repo>', '', () => {}, ghExists)
  .command('github-branches <repo>', '', () => {}, ghBranches)
  .command('github-create <repo> <description>', 'Create a github repo', () => {}, ghCreate)

  .command(['clean', 'delete'], 'Clean up all created resources', () => {}, clean)
  .command(['init', 'setup'], 'setup the project', () => {}, setup)
  .demandCommand(1, 1).argv
/* eslint-enable no-unused-expressions */
