const simpleGit = require('simple-git/promise')

const git = {}

git.initialSetup = async ({ workingDir, githubUser, repositoryName }) => {
  const execGit = simpleGit(workingDir)
  await execGit.init()
  await execGit.add('./*')
  await execGit.commit('initial commit')
  await execGit.addRemote('origin', `https://github.com/${githubUser}/${repositoryName}.git`)
  await execGit.push('origin', 'master')
}

module.exports = git
