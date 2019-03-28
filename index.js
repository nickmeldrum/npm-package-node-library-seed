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
  console.log('info', list.length)
}

const branches = async () => {
  const list = await gh.repo.branches('nickmeldrumdotcom')
  console.log('info', list.length)
}

const exists = async () => {
  const newRepo = await gh.repo.exists('new-repo')
  console.log('exists', newRepo)
}

/* eslint-disable no-unused-expressions */
require('yargs')
  .command('exists', '', () => {}, exists)
  .command('branches', '', () => {}, branches)
  .command('clean', 'Clean up all created resources', () => {}, clean)
  .command('repos', 'list github repos', () => {}, repos)
  .command(['create', '*'], 'Create the repo', () => {}, create)
  .demandCommand(1, 1).argv
/* eslint-enable no-unused-expressions */
