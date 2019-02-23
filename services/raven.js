var Raven = require('raven')
Raven.config(
  'https://45a3bdcc11094cb09fd6417f68fe3b58@sentry.mofe.io/3'
).install()

module.exports = Raven
