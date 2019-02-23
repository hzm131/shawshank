const rbac = require('../../lib/rbac')

it('should allow admin to access all api', async ()=>{
  const result = await rbac('admin').check({
    path: '/v1',
    verb: 'post'
  })

  expect(result).toBe(true)
})

