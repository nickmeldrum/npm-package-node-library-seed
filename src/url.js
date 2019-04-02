const whatwgUrl = require('whatwg-url')

const urlMatcher = new RegExp('^(?:[a-z]+:)?//', 'i')
const isAbsolute = url => urlMatcher.test(url)

const ensureAbsolute = (relative, baseUrl) => {
  if (isAbsolute(relative)) return relative
  const slash = baseUrl.endsWith('/') || relative.startsWith('/') ? '' : '/'
  const fixedRelative =
    baseUrl.endsWith('/') && relative.startsWith('/') ? relative.substring(1) : relative
  return `${baseUrl}${slash}${fixedRelative}`
}

const ensureScheme = url => (!isAbsolute(url) ? `http://${url}` : url)

const getUrlAsObject = url => whatwgUrl.parseURL(url)

module.exports = {
  isAbsolute,
  ensureAbsolute,
  ensureScheme,
  getUrlAsObject,
}
