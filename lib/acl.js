const pathToRegexp = require('path-to-regexp')

const acl = rules => ({
  check: (request) => {
    const { allow = [], deny = [] } = rules
    if (allow.length === 0) {
      return false
    }

    for (let i = 0, len = deny.length; i < len; i++) {
      let rule = deny[i]
      if(rule.verb === '*' || rule.verb === request.verb){
        const result = pathToRegexp(rule.path).exec(request.path)

        // if match then deny this request
        if(result){
          return false
        }
      }
    }

    for (let i = 0, len = allow.length; i < len; i++) {
      let rule = allow[i]
      if(rule.verb === '*' || rule.verb === request.verb){
        const result = pathToRegexp(rule.path).exec(request.path)

        // if match then allow this request
        if(result){
          return true
        }
      }
    }

    return false
  }
})

module.exports = acl
