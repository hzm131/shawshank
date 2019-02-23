const acl = require('../../lib/acl')

it('should deny all request when do not has allow rules', () => {
  const result = acl({
    allow: [],
    deny: []
  }).check({ path: '/a/b/c', verb: 'get' })

  expect(result).toBe(false)
})

it('should deny a request when deny rule is matched and allow rule is matched', () => {
  const request = { path: '/a/b/c', verb: 'get' }

  const result = acl({
    allow: [request],
    deny: [request]
  }).check(request)

  expect(result).toBe(false)
})

// eslint-disable-next-line
it("should deny a request when deny rule' path is match && verb is *", () => {
  const request = { path: '/a/b/c', verb: 'get' }

  const result = acl({
    allow: [],
    deny: [{ path: request.path, verb: '*' }]
  }).check(request)

  expect(result).toBe(false)
})

it('should allow a request when deny rule is not matched && allow rule is matched', ()=>{
  const request = { path: '/a/b/c', verb: 'get' }

  const result = acl({
    allow: [{ path: '/a/b/c', verb: 'get' }],
    deny: []
  }).check(request)

  expect(result).toBe(true)
})

it('should deny a request when all rule is not matched', ()=>{
  const request = { path: '/a/b/c', verb: 'get' }

  const result = acl({
    allow: [{ path: '/b', verb: 'get' }],
    deny: [{ path: '/b', verb: 'get'}]
  }).check(request)

  expect(result).toBe(false)
})
