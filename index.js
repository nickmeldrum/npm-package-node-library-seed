const gh = require('gh-got')
const tunnel = require('tunnel')

const agent = tunnel.httpsOverHttp({
  proxy: {
    host: 'http.proxy.fmr.com',
    port: 8000,
  },
})

const body = {
  name: 'new-repo',
  description: 'test-description',
}

;(async () => {
  await gh('user/repos', { token: process.env.GITHUB_TOKEN, agent, body })
})()
