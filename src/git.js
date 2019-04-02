const simpleGit = require('simple-git/promise')
const config = require('./config')

const git = {}

git.initialSetup = async () => {
  const execGit = simpleGit(config.workingDir)
  await execGit.init()
  await execGit.add('./*')
  await execGit.commit('initial commit')
  await execGit.addRemote(
    'origin',
    `https://github.com/${config.author.github_username}/${config.project.repo_name}.git`,
  )
  await execGit.push('origin', 'master')
}

module.exports = git
