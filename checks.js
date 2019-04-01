module.exports = config => {
  const checks = {}

  checks.checkTokens = () => {
    if (!config.authentication.github_token) throw new Error('github token not set')
    if (!config.authentication.travis_token) throw new Error('travis token not set')
    if (!config.authentication.npm_token) throw new Error('npm token not set')
  }

  checks.validateConfig = () => {
    checks.checkTokens()
  }

  return checks
}
