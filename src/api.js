const got = require('got')
const tunnel = require('tunnel')
const urlHelper = require('./url')

const call = ({ baseUrl, headers, token = null, proxy = null }) => (
  url,
  options = {},
  json = true,
) =>
  got(urlHelper.ensureAbsolute(url, baseUrl), {
    agent: proxy
      ? tunnel.httpsOverHttp({
          proxy: {
            host: proxy.host,
            port: proxy.port,
          },
        })
      : null,
    json,
    headers: { ...headers, authorization: `token ${token}` },
    ...options,
  })

module.exports = call
