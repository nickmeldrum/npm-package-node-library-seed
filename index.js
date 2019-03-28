/* eslint-disable no-console */
const setupGithub = require('./github')

const gh = setupGithub({
  author: 'nickmeldrum',
  token: process.env.GITHUB_TOKEN,
  proxy: {
    host: 'http.proxy.fmr.com',
    port: 8000,
  },
})

const clean = async () => {
  await gh.repos.delete('new-repo')
}

const create = async () => {
  await gh.repos.create('new-repo', 'test-description')
}

const repos = async () => {
  const list = await gh.repos.list()
  console.log('repos:', list.map(item => item.name))
}

const branches = async () => {
  const list = await gh.repo.branches('nickmeldrumdotcom')
  console.log('branches:', list.map(item => item.name))
}

const exists = async args => {
  const repoExists = await gh.repo.exists(args.repo)
  console.log(args.repo, repoExists ? 'exists' : "doesn't exist")
}

/* eslint-disable no-unused-expressions */
require('yargs')
  .command('exists <repo>', '', () => {}, exists)
  .command('branches <repo>', '', () => {}, branches)
  .command(['clean', 'delete'], 'Clean up all created resources', () => {}, clean)
  .command(['repos', 'list'], 'list github repos', () => {}, repos)
  .command(['create', '*'], 'Create the repo', () => {}, create)
  .demandCommand(1, 1).argv
/* eslint-enable no-unused-expressions */
