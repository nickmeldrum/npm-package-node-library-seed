const path = require('path')
const simpleGit = require('simple-git/promise')

module.exports = config => {
  const workingDir = path.join(config.git.rootPath, config.project.name)

  const git = {}

  git.initialSetup = async () => {
    const execGit = simpleGit(workingDir)
    await execGit.init()
    await execGit.add('./*')
    await execGit.commit('initial commit')
    await execGit.addRemote(
      'origin',
      `https://github.com/${config.github.author}/${config.project.name}.git`,
    )
    await execGit.push('origin', 'master')
  }

  return git
}
