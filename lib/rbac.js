const yaml = require('js-yaml')
const acl = require('./acl')

const ruleset = yaml.safeLoad(`
admin:
  allow:
  - path: "/(.*)"
    verb: "*"
  deny: []
`)


const rbac = (role) => ({
  check: async (request)=>{
    return acl(ruleset[role]).check(request)
  }
})

module.exports = rbac
