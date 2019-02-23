const ensureLoginMiddleware = require('../../lib/middleware-ensure-login')

let ctx

beforeEach(() => {
  ctx = {}

  ensureLoginMiddleware({
    deserialize: () => true
  })(ctx, () => true)
})

it('shoud add ensureLogin to ctx', () => {
  expect(ctx).toHaveProperty('ensureLogin')
})

it('should ensure request has the "authentication" header', async () => {
  ctx.header = { authorization: '' }
  try {
    await ctx.ensureLogin()
  } catch (e) {
    expect(e.code).toEqual(401001)
  }
})

it('should ensure the "authentication" header prefix by "Bearer"', async () => {
  ctx.header = { authorization: 'xxxxx' }
  try {
    await ctx.ensureLogin()
  } catch (e) {
    expect(e.code).toEqual(401003)
  }
})
